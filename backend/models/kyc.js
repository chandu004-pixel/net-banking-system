const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    documenttype: { type: String, enum: ['Aadhar', 'Pan', 'Passport'], required: true },
    documentnumber: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    photo: { type: String },
}, { timestamps: true });


module.exports = mongoose.model('KYC', kycSchema);