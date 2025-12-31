const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const u = new User({ name, email });
        await u.save();
        res.status(201).json(u);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).json({ error: "User not found" });
        res.status(200).json(u);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const txs = await Transaction.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(txs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};

