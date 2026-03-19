const express = require("express");
const router = express.Router();
const userctrl = require('../controllers/userController');


const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/', userctrl.createUser);
router.get('/admin/stats', authMiddleware, isAdmin, userctrl.getAdminStats);
router.get('/:id', authMiddleware, userctrl.getUser);
router.get('/:id/transactions', authMiddleware, userctrl.getUserTransactions);

module.exports = router;