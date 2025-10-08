// controllers/kycController.js
const KYC = require('../models/kyc');

// CREATE
exports.addKYC = async (req, res) => {
  try {
    // FIX: Change 'payload' to 'req.body' to access the request data
    const kyc = new KYC(req.body); 
    
    // Optional: You might want to log the data being saved for debugging
    // console.log('Data received:', req.body);
    
    await kyc.save();
    res.status(201).json({ success: true, message: 'KYC added', data: kyc });
  } catch (err) {
    console.error('addKYC error:', err);
    // Use status 400 for validation errors or bad input
    res.status(400).json({ success: false, error: err.message });
  }
};

// READ ALL (Completing the function based on your snippet)
exports.getAllKYC = async (req, res) => {
  try {
    const data = await KYC.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('getAllKYC error:', err);
    res.status(500).json({ success: false, error: err.message }); // Added 500 status for server error
  }
};