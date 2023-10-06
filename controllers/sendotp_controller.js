const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
    return { status, message, data };
};

const sendOtp = async (req, res) => {
    const { mobile, otp, provider_id } = req.body;

    try {

        db.pool.query('INSERT INTO otprecords (mobile, otp, provider_id) VALUES ($1, $2, $3) RETURNING *', [mobile, '123456', provider_id], (err, insertResult) => {
            if (err) {
                console.log(err);
                const response = commonResponse(500, 'An error occurred while adding to the loginuser.', null);
                return res.status(500).json(response);
            }

            const response = {
                status: 200,
                message: 'Donation created successfully',
                data: insertResult.rows[0],
            };

            res.status(200).json(response);

        });

    } catch (error) {
        console.error('Error occurred:', error);

        const response = {
            status: 500,
            message: 'An error occurred while adding the donation.',
            data: null,
        };

        res.status(500).json(response);
    }
};

const varifyOtp = (req, res) => {
  const id = req.body.id;
  const otp = req.body.otp;
  const uid = req.body.uid;
  const qty = 1; 
  const rate = 10;

  db.pool.query('SELECT * FROM otprecords WHERE id = $1 AND otp = $2', [id, otp])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'OTP not found.'
        });
      } else {
        const otpRecord = result.rows[0];   
        
        db.pool.query(`SELECT mobile FROM donner WHERE mobile = $1`, [otpRecord.mobile])
          .then((donnerResult) => {
            if (donnerResult.rows.length === 0) {
              res.status(404).json({
                status: 404,
                message: 'Donner not found.'
              });
            } else {
              const donnerMobile = donnerResult.rows[0].mobile;

              db.pool.query(
                'INSERT INTO transaction (mobile, qty, rate, uid) VALUES ($1, $2, $3, $4) RETURNING *',
                [donnerMobile, qty, rate, uid]
              )
                .then((transactionResult) => {
                  const insertedTransaction = transactionResult.rows[0];
                  res.json({
                    status: 200,
                    message: 'OTP verified. Transaction recorded successfully.',
                    data: insertedTransaction
                  });
                })
                .catch((transactionErr) => {
                  console.error(transactionErr);
                  res.status(500).json({
                    status: 500,
                    error: 'An error occurred while inserting data into the transaction table.'
                  });
                });
            }
          })
          .catch((donnerErr) => {
            console.error(donnerErr);
            res.status(500).json({
              status: 500,
              error: 'An error occurred while fetching data from the donner table.'
            });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: 500,
        error: 'An error occurred while fetching data from the database.'
      });
    });
};


const getTransaction = async (req, res) => {
  try {
    const { uid } = req.body;

    const totalCountQuery = 'SELECT COUNT(*) AS total_transactions FROM transaction WHERE uid = $1';
    const totalCountValues = [uid];

    const transactionQuery = 'SELECT * FROM transaction WHERE uid = $1 ORDER BY created_at DESC';
    const transactionValues = [uid];

    const totalCountResult = await db.pool.query(totalCountQuery, totalCountValues);
    const totalTransactions = totalCountResult.rows[0].total_transactions;

    const transactionResult = await db.pool.query(transactionQuery, transactionValues);
    const transactions = transactionResult.rows;

    res.status(200).json({
      msg: "Transaction data fetched successfully",
      total_transactions: totalTransactions,
      transactions: transactions,
      status: 1
    });
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
module.exports = {
    sendOtp,
    varifyOtp,
    getTransaction
};