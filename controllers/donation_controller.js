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

// Function to add a leading zero to single-digit numbers
function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number.toString();
}

function convertUTCToIST(utcDateString) {
  const utcDate = new Date(utcDateString);

  const indianTimeOffsetMinutes = 330;

  utcDate.setMinutes(utcDate.getMinutes() + indianTimeOffsetMinutes);

  const day = addLeadingZero(utcDate.getDate());
  const month = addLeadingZero(utcDate.getMonth() + 1); 
  const year = utcDate.getFullYear().toString().slice(-2);

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

const getDonation = async (req, res) => {
  try {
    const { uid } = req.body;

    const query = 'SELECT * FROM donation WHERE uid = $1 ORDER BY created_at DESC';
    const values = [uid];

    const result = await db.pool.query(query, values);

    const dataWithISTDates = result.rows.map(row => ({
      ...row,
      created_at: convertUTCToIST(row.created_at),
    }));

    res.status(200).json({
      msg: "Data fetched successfully",
      data: dataWithISTDates,
      status: 1
    });
  } catch (error) {
    console.error('Error fetching donation data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const utcDateString = '2023-10-04T12:30:00Z';
const istDate = convertUTCToIST(utcDateString);


module.exports = {
  addDonation,
  getDonation
};