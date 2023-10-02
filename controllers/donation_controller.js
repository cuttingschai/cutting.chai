const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};


const addDonation = async (req, res) => {
  const { uid, donation_amount, payment_id } = req.body;

  try {

    db.pool.query('INSERT INTO donation (uid, donation_amount, payment_id) VALUES ($1, $2, $3) RETURNING *', [uid, donation_amount, payment_id], (err, insertResult) => {
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

const getDonation = async (req, res) => {
  try {
    const { uid } = req.body;

    const query = 'SELECT * FROM donation WHERE uid = $1 ORDER BY created_on DESC';
    const values = [uid];

    const result = await db.pool.query(query, values);

    res.status(200).json({
      msg: "Data fetched successfully",
      data: result.rows,
      status: 1
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  addDonation,
  getDonation

};