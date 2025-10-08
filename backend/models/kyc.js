const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
    userId: { type: String, ref: "User", required: true }, // usually not unique unless 1 KYC per user!
    fullname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    idProofType: { 
        type: String, 
        enum: ['Aadhar', 'PAN', 'Passport'], // Match frontend exactly!
        required: true 
    },
    idProofNumber: { type: String, required: true, unique: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Verified', 'Rejected'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model("KYC", kycSchema);
