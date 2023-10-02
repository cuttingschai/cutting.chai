const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const addUser = (req, res) => {
  const { uid, user_type, mobile } = req.body;

  if(user_type == "donner") {
    checkMobileDonnerExists(mobile)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200).json({
          msg: "User is available",
          data: rows[0]
        });
      } else {
        // Proceed with the insertion into loginuser table
        db.pool.query('INSERT INTO donner (uid, user_type, mobile) VALUES ($1, $2, $3) RETURNING *', [uid, user_type, mobile], (err, insertResult) => {
          if (err) {
            console.log(err);
            const response = commonResponse(500, 'An error occurred while adding to the loginuser.', null);
            return res.status(500).json(response);
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
      const response = commonResponse(500, 'An error occurred while checking mobile number existence.', null);
      return res.status(500).json(response);
    });
  } else {

    if(user_type == "provider") 
    checkMobileproviderExists(mobile)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200).json({
          msg: "User is available",
          data: rows[0]
        });
      } else {
        // Proceed with the insertion into loginuser table
        db.pool.query('INSERT INTO provider (uid, user_type, mobile) VALUES ($1, $2, $3) RETURNING *', [uid, user_type, mobile], (err, insertResult) => {
          if (err) {
            console.log(err);
            const response = commonResponse(500, 'An error occurred while adding to the loginuser.', null);
            return res.status(500).json(response);
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
      const response = commonResponse(500, 'An error occurred while checking mobile number existence.', null);
      return res.status(500).json(response);
    });
  }

  // Check if mobile number already exists
  
};

// Replace this with your actual implementation
function checkMobileproviderExists(mobile) {
  return new Promise((resolve, reject) => {
    db.pool.query('SELECT * FROM provider WHERE mobile = $1', [mobile], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
}

function checkMobileDonnerExists(mobile) {
  return new Promise((resolve, reject) => {
    db.pool.query('SELECT * FROM donner WHERE mobile = $1', [mobile], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
}

// Replace this with your actual implementation
function handleInsertResult(err, insertResult, res) {
  // Implement your logic for handling insert results
}


const updateUser = async (req, res) => {
  const { uid, name, email, user_type } = req.body;

  try {
    await db.pool.query('BEGIN'); // Start the transaction

    // Update the donner table if user_type is 'donner' and uid matches
    const donnerQuery = `UPDATE donner SET name = $1, email = $2 WHERE user_type = $3 AND uid = $4 RETURNING *`;
    const donnerValues = [name, email, user_type, uid];
    const donnerResult = await db.pool.query(donnerQuery, donnerValues);
    const updatedDonnerRecord = donnerResult.rows[0];

    await db.pool.query('COMMIT'); // Commit the transaction

    res.status(200).json({
      status: 200,
      message: 'Data updated successfully!',
      data: updatedDonnerRecord,
    });
  } catch (error) {
    await db.pool.query('ROLLBACK'); // Rollback the transaction in case of an error
    console.error('Error occurred:', error);
    res.status(500).send('An error occurred while updating the data.');
  } finally {
    await db.pool.query('END'); // End the transaction
  }
};

const getUserDetail = (req, res) => {

  const { uid, user_type } = req.body;

  console.log(user_type);

  if(user_type == "donner") {
    db.pool.query('SELECT * FROM donner WHERE uid = $1', [uid])
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



module.exports = {
    addUser,
    updateUser,
    getUserDetail
  };