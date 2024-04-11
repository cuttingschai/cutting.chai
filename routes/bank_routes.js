const express = require("express");
const router = express.Router();

const bankController = require("../controllers/bank_controller");
router.post('/addBank', bankController.addBank);
router.post('/getBank', bankController.getBank);
router.post('/updateBank', bankController.updateBank);
router.post('/updateEdit', bankController.updateEdit);

module.exports = router;