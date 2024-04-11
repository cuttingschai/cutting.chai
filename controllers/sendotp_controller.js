const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
    return { status, message, data };
};

const sendOtp = async (req, res) => {
  const { mobile, otp, provider_id } = req.body;

  try {
      const lastOtpRecord = await db.pool.query('SELECT * FROM otprecords WHERE mobile = $1 ORDER BY created_at DESC LIMIT 1', [mobile]);

      if (lastOtpRecord.rows.length > 0) {
          const lastOtpTime = new Date(lastOtpRecord.rows[0].created_at).getTime();
          const currentTime = new Date().getTime();
          const timeDifferenceHours = (currentTime - lastOtpTime) / (1000 * 60 * 60);

          if (timeDifferenceHours < 24) {
              const response = commonResponse(400, 'OTP already sent in the last 24 hours.', null);
              return res.status(400).json(response);
          }
      }
      
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
  const mobile = req.body.mobile;
  const qty = 1; 
  const rate = 10;

  db.pool.query('SELECT * FROM otprecords WHERE mobile = $1 AND otp = $2', [mobile, otp])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'OTP not found.'
        });
      } else {
        const mobile = result.rows[0].mobile;   

        //const donnerMobile = donnerResult.rows[0].mobile;

        db.pool.query(
          'INSERT INTO transaction (mobile, qty, rate, uid) VALUES ($1, $2, $3, $4) RETURNING *',
          [mobile, qty, rate, uid]
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

    const currentDate = new Date();

    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);

    const transactionQuery = 'SELECT * FROM transaction WHERE uid = $1 ORDER BY created_at DESC';
    const transactionValues = [uid];

    const transactionResult = await db.pool.query(transactionQuery, transactionValues);
    const transactions = transactionResult.rows.map(row => {
      const total = row.rate * row.qty;
      const formattedDate = new Date(row.created_at).toLocaleDateString('en-GB'); 
      return { ...row, total: total.toFixed(2), created_at: formattedDate };
    });

    const totalRate = transactions.reduce((total, row) => total + parseFloat(row.total), 0);

    res.status(200).json({
      success: true,
      message: "Transaction data fetched successfully",
      total_transactions: transactions.length,
      transactions: transactions,
      total_rate: parseFloat(totalRate.toFixed(2)), 
      status: 200, 
    });
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message, 
    });
  }
};

 
module.exports = {
    sendOtp,
    varifyOtp,
    getTransaction
};