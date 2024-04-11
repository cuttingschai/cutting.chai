const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

;
const updateProvider = async (req, res) => {
  const { uid, mobile, name, city, address, pincode } = req.body;

  try {
    const query = `
      UPDATE provider 
      SET mobile = $1, name = $2, city = $3, address = $4, pincode = $5
      WHERE uid = $6 AND is_approver = false
      RETURNING *`;

    const values = [mobile, name, city, address, pincode, uid];
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

const getProviderDetail = (req, res) => {

  const { uid, user_type } = req.body;

  console.log(user_type);

  if (user_type == "provider") {
    db.pool.query('SELECT * FROM provider WHERE uid = $1', [uid])
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({
            status: 404,
            message: 'User not found.'
          });
        } else {
          res.json({
            status: 200,
            message: 'User detail',
            data: result.rows[0]
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
  }
};

const updateApprover = async (req, res) => {
  const { is_approver, uid } = req.body;

  try {
    const query = `UPDATE provider SET is_approver = $1 WHERE uid = $2 RETURNING *`;

    const values = [is_approver,uid];
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
  updateProvider,
  getProviderDetail,
  updateApprover
};