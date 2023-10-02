const express = require("express");
const router = express.Router();

const donationController = require("../controllers/donation_controller");
router.post('/addDonation', donationController.addDonation);
router.post('/getDonation', donationController.getDonation);



module.exports = router;