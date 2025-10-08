const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    amount: { type:Number, required: true },
    type:{type:String, enum:['deposit','withdraw'],required:true},
    status:{type:String, enum:['pending','completed','failed'], default:'pending'},
    razorpayOrderId:String,
    razorpayPaymentId:String,
    razorpaySignature:String,
    
},{timestamps:true});

module.exports = mongoose.model('Transaction',txSchema);