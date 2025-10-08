const express = require("express");
const router = express.Router();
const payctrl = require('../controllers/paymentController');


router.post('/order',payctrl.createorder);
router.post('/verify',payctrl.verifyPayment);
router.get('/withdraw',payctrl.withdraw);

module.exports = router;