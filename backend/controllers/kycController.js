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
    console.log('addKYC Request Body:', req.body);
    console.log('addKYC Request Files:', req.files);
    const payload = req.body.formData ? (typeof req.body.formData === 'string' ? JSON.parse(req.body.formData) : req.body.formData) : req.body;

    // Normalize field names
    const fullname = payload.fullname || payload.fullName;
    const documenttype = payload.documenttype || payload.documentType;
    const documentnumber = payload.documentnumber || payload.documentNumber;
    const dob = payload.dob;
    const address = payload.address;

    console.log('Normalized Payload:', { fullname, dob, address, documenttype, documentnumber });

    if (!fullname || !dob || !address || !documenttype || !documentnumber) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    payload.fullname = fullname;
    payload.documenttype = documenttype;
    payload.documentnumber = documentnumber;

    // Cast dob to Date
    payload.dob = new Date(payload.dob);

    // Associate with user
    payload.user = req.user.userId;

    // Handle files if uploaded via multer upload.fields
    if (req.files) {
      if (req.files.idFile) payload.idFile = req.files.idFile[0].filename;
      if (req.files.addressFile) payload.addressFile = req.files.addressFile[0].filename;
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
    console.log(`getAllKYC: Found ${data.length} records`);
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

exports.updateKYC = async (req, res) => {
  try {

    // 👇 Extract uploaded files (if any)
    const idFile = req.files?.idFile?.[0]?.filename;
    const addressFile = req.files?.addressFile?.[0]?.filename;

    // 👇 Build updated data object
    const updatedData = {
      ...req.body,
    };

    // 👇 Only add file fields if they exist
    if (idFile) {
      updatedData.idFile = idFile;
    }

    if (addressFile) {
      updatedData.addressFile = addressFile;
    }

    // 👇 Update in DB
    const updatedKyc = await KYC.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedKyc);

  } catch (error) {
    res.status(500).json({ message: error.message });
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