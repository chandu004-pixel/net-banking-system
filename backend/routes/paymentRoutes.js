const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.createorder);
router.post('/verify-payment', authMiddleware, paymentController.verifyPayment);
router.post('/withdraw', authMiddleware, paymentController.withdraw);

module.exports = router;

