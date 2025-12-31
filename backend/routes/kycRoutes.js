const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const kycController = require('../controllers/kycController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', authMiddleware, upload.single('photo'), kycController.addKYC);
router.get('/', authMiddleware, kycController.getAllKYC);
router.get('/:id', authMiddleware, kycController.getKYCById);
router.put('/:id', authMiddleware, upload.single('photo'), kycController.updateKYC);
router.delete('/:id', authMiddleware, kycController.deleteKYC);


module.exports = router;