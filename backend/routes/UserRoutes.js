const express = require("express");
const router = express.Router();
const userctrl = require('../controllers/userController');


const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post('/', userctrl.createUser);
router.get('/admin/stats', authMiddleware, isAdmin, userctrl.getAdminStats);
router.get('/all', authMiddleware, isAdmin, userctrl.getAllUsersManagement);
router.put('/manage/:id', authMiddleware, isAdmin, userctrl.updateUserManagement);

// Own Profile Management
router.put('/profile', authMiddleware, userctrl.updateProfile);
router.put('/change-password', authMiddleware, userctrl.changePassword);

router.get('/:id', authMiddleware, userctrl.getUser);
router.get('/:id/transactions', authMiddleware, userctrl.getUserTransactions);

module.exports = router;