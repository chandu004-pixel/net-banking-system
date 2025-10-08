const express = require("express");
const router = express.Router();
const userctrl = require('../controllers/userController');


router.post('/',userctrl.createUser);
router.get('/:id',userctrl.getUser);
router.get('/:id/transactions',userctrl.getTransactions);

module.exports = router;