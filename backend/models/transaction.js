const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    amount: { type:Number, required: true },
    type:{type:String, enum:['deposit','withdraw', 'transfer_internal', 'transfer_domestic', 'transfer_international'],required:true},
    status: { type: String, enum: ['pending', 'completed', 'failed', 'flagged', 'frozen'], default: 'pending' },
    recipientName: String,
    recipientAccount: String,
    recipientIfsc: String,
    destinationCurrency: String,
    exchangeRateApplied: Number,
    feeCharged: Number,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amlScore: { type: Number, default: 0 },
    isFrozen: { type: Boolean, default: false },
    fraudReason: String,
    
},{timestamps:true});

module.exports = mongoose.model('Transaction',txSchema);