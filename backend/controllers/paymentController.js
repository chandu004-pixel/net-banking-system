const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require("dotenv");
const Transaction = require('../models/Transaction');
const User = require('../models/User');
dotenv.config();
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
});

//CREATE ORDER
exports.createorder = async(req,res)=>{
    try {
        const{amount,userId} = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:'user not found'});

        const options = {
            amount:Math.round(Number(amount)* 100),
            currency:'INR',
            receipt:`rcpt_${Date.now()}`,
            payment_capture:1
        };
        const order = await razorpay.orders.create(options);

        const tx = new Transaction({
            user:user._id,
            amount:Number(amount),
            type:'deposit',
            status:'pending',
            razorpayOrderId:order.id
        });
        await tx.save();
        res.json({order,txId:tx._id,key:process.env.RAZORPAY_KEY_ID})
    } catch(err) {
        console.error(err);
    }
};

//verify payment

exports.verifyPayment = async (req,res) =>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,txId} = req.body;
        //genarate signature
        const genarate_signature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

        if(genarate_signature !==razorpay_signature){
            await Transaction.findByIdAndUpdate(txId,{status:'failed'});
            return res.status(404).json({error:'invalid signature'});
        }
        const tx = await Transaction.findById(txId);
        if(!tx) return res.status(400).json({error:'transtion not found'});
        if(tx.status ==='completed') return res.json({message:'already processed'});
        tx.status = 'completed';
        tx.razorpayPaymentId = razorpay_payment_id;
        tx.razorpaySignature = razorpay_signature;
        await tx.save();

        await User.findByIdAndUpdate(tx.user, {$inc:{balance:tx.amount}});
        res.json({message:'payment verified and balnce updated'});
    } catch(err) {
        console.error("verifypayment error",err);
    }
}

//withdraw

exports.withdraw = async(req,res)=>{
    try {
        const{userId,amount} = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:'user not found'});
        const numeric = Number(amount);
        if(user.balance <numeric) return res.status(400).json({error:'insufficient balnce'});

        user.balance = user.balance - numeric;
        await user.save();

        const tx = new Transaction({
            user:user._id,
            amount:numeric,
            type:'withdraw',
            status:'completed',
            
        });
        await tx.save();
        res.json({message:"withdraw proccesed",tx});
    } catch(err) {
        console.error(err);
    }
};