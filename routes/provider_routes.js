const express = require("express");
const router = express.Router();

const providerController = require("../controllers/provider_controller");
router.post('/updateProvider', providerController.updateProvider);
router.post('/getProviderDetail', providerController.getProviderDetail);
router.post('/updateApprover', providerController.updateApprover);

module.exports = router;