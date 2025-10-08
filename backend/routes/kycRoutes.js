// routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycControllers');
// Routes
router.post('/', kycController.addKYC);
router.get('/', kycController.getAllKYC);


module.exports = router;