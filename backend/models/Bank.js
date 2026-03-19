const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Linked', 'Verified'],
        default: 'Linked'
    }
}, { timestamps: true });

module.exports = mongoose.model('Bank', bankSchema);
