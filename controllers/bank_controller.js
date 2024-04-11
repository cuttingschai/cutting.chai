const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};


const addBank = async (req, res) => {
  const { uid, bank_name, bank_holder_name, account_number, account_type, ifsc_code } = req.body;
console.log('mayur');
  try {

    db.pool.query('INSERT INTO bank_details (uid, bank_name, bank_holder_name, account_number, account_type, ifsc_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [uid, bank_name, bank_holder_name, account_number, account_type, ifsc_code], (err, insertResult) => {
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


const getBank = async (req, res) => {
    try {
      const { uid } = req.body;
  
      const query = 'SELECT * FROM bank_details WHERE uid = $1';
      const values = [uid];
  
      const result = await db.pool.query(query, values);
  
      res.status(200).json({
        msg: "Data fetched successfully",
        status: 1,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error fetching donation data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const updateBank = async (req, res) => {
    const { uid, bank_name, bank_holder_name, account_number, account_type, ifsc_code } = req.body;
  
    try {
      const query = `UPDATE bank_details SET bank_name = $1, bank_holder_name = $2, account_number =$3, account_type = $4, ifsc_code = $5 WHERE uid = $6 RETURNING *`;
  
      const values = [bank_name, bank_holder_name, account_number, account_type, ifsc_code, uid];
      const result = await db.pool.query(query, values);
  
      if (result.rows.length > 0) {
        const updatedRecord = result.rows[0];
        res.status(200).json({
          status: 200,
          message: 'Data updated successfully!',
          data: updatedRecord,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'No record found for the given UID.',
        });
      }
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({
        status: 500,
        message: 'An error occurred while updating the data.',
        error: error.message, 
      });
    }
  };
  
  const updateEdit = async (req, res) => {
    const { is_edit, uid } = req.body;
  
    try {
      const query = `UPDATE bank_details SET is_edit = $1 WHERE uid = $2 RETURNING *`;

      const values = [is_edit,uid];
      const result = await db.pool.query(query, values);
      const updatedRecord = result.rows[0];
  
      res.status(200).json({
        status: 200,
        message: 'Data updated successfully!',
        data: updatedRecord,
      });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while updating the data.');
    }
  };

module.exports = {
    addBank,
    getBank,
    updateBank,
    updateEdit
};