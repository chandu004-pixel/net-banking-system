// controllers/kycController.js
const fs = require('fs');
const path = require('path');
const KYC = require('../models/KYC');

const uploadsDir = path.join(__dirname, '..', 'uploads'); // adjust if your uploads folder is elsewhere

// helper: remove file if exists
function removeFileIfExists(filename) {
  if (!filename) return;
  const fp = path.join(uploadsDir, filename);
  fs.access(fp, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(fp, (unlinkErr) => {
        if (unlinkErr) console.warn('Failed to remove file', fp, unlinkErr);
      });
    }
  });
}

// CREATE
exports.addKYC = async (req, res) => {
  try {
    const payload = req.body.formData ? (typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData) : req.body;

    if (!payload.fullname || !payload.dob || !payload.address || !payload.documenttype || !payload.documentnumber) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Cast dob to Date
    payload.dob = new Date(payload.dob);

    // Associate with user
    payload.user = req.user.userId;

    // Handle photo if uploaded via multer
    if (req.file) {
      payload.photo = req.file.filename;
    }

    const kyc = new KYC(payload);
    await kyc.save();

    res.status(201).json({ success: true, message: 'KYC submitted successfully', data: kyc });
  } catch (err) {
    console.error('addKYC error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};


// READ ALL
exports.getAllKYC = async (req, res) => {
  try {
    const data = await KYC.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getAllKYC error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// READ ONE
exports.getKYCById = async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.id);
    if (!kyc) return res.status(404).json({ success: false, error: 'KYC not found' });
    res.status(200).json({ success: true, data: kyc });
  } catch (err) {
    console.error('getKYCById error:', err);
    res.status(400).json({ success: false, error: 'Invalid id' });
  }
};

// UPDATE
exports.updateKYC = async (req, res) => {
  try {
    // Load existing doc first to detect if photo exists
    const existing = await KYC.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'KYC not found' });

    const payload = { ...req.body };
    if (payload.dob) payload.dob = new Date(payload.dob);


    // Update with validators
    const updated = await KYC.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    // If new file uploaded and existing had a photo, remove old file
    if (req.file && existing.photo) {
      removeFileIfExists(existing.photo);
    }

    res.status(200).json({ success: true, message: 'KYC updated', data: updated });
  } catch (err) {
    console.error('updateKYC error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE
exports.deleteKYC = async (req, res) => {
  try {
    const deleted = await KYC.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'KYC not found' });

    // remove photo file if present
    if (deleted.photo) removeFileIfExists(deleted.photo);

    res.status(200).json({ success: true, message: 'KYC deleted' });
  } catch (err) {
    console.error('deleteKYC error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};