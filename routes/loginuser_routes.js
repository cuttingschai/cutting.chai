const express = require("express");
const router = express.Router();

const loginuserController = require("../controllers/loginuser_controller");
router.post('/adduser', loginuserController.addUser);
router.post('/updateuser', loginuserController.updateUser);
router.post('/getUser', loginuserController.getUserDetail);




module.exports = router;