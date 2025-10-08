const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createUser = async (req,res) => {
    try {
        const {name,email} = req.body;
        const u = new User({name,email});
        await u.save();
        res.status(201).json(u);
    } catch(err) {
        console.error(err);
    }
};

exports.getUser = async (req,res) => {
    try {
        const u = await User.findById(req.params.id);
        res.status(201).json(u);
    } catch(err) {
        console.error(err);
    }
};
exports.getTransactions = async (req,res) => {
    try {
        const tx = await Transaction.find({user:req.params.id}).toSorted({createdAt:-1});
        res.status(201).json(tx);
    } catch(err) {
        console.error(err);
    }
};