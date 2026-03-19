const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bankController.linkBank);
router.get('/', authMiddleware, bankController.getLinkedBanks);
router.delete('/:id', authMiddleware, bankController.removeBank);

module.exports = router;
