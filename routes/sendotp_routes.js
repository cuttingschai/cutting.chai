const express = require("express");
const router = express.Router();

const sendotpController = require("../controllers/sendotp_controller");
router.post('/sendOtp', sendotpController.sendOtp);
router.post('/varifyOtp', sendotpController.varifyOtp);
router.post('/getTransaction', sendotpController.getTransaction);
module.exports = router;