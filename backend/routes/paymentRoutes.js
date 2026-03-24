const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/create-order', authMiddleware, paymentController.createorder);
router.post('/verify-payment', authMiddleware, paymentController.verifyPayment);
router.post('/fund-simulator', authMiddleware, paymentController.simulateFunding);
router.post('/withdraw', authMiddleware, paymentController.withdraw);

// Core Banking Routes
router.post('/transfer/internal', authMiddleware, paymentController.executeInternalTransfer);
router.post('/transfer/domestic', authMiddleware, paymentController.executeDomesticTransfer);
router.post('/fx-quote', authMiddleware, paymentController.calculateFX);
router.post('/transfer/international', authMiddleware, paymentController.executeInternationalTransfer);

router.get('/frozen', authMiddleware, isAdmin, paymentController.getFrozenTransactions);
router.post('/resolve-frozen', authMiddleware, isAdmin, paymentController.resolveFrozenTransaction);

module.exports = router;

