const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    phone: { type: String }, // Used by admins for OTP
    otp: { type: String },
    otpExpiry: { type: Date },
    accountNumber: { type: String, unique: true, sparse: true },
    ifscCode: { type: String, default: 'NEXB0000001' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);