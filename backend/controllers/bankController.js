const Bank = require('../models/Bank');

exports.linkBank = async (req, res) => {
    try {
        const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;
        const userId = req.user.userId;

        if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const bank = new Bank({
            user: userId,
            bankName,
            accountNumber,
            ifscCode,
            accountHolderName
        });

        await bank.save();
        res.status(201).json({ success: true, message: 'Bank linked successfully', data: bank });
    } catch (err) {
        console.error('linkBank error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getLinkedBanks = async (req, res) => {
    try {
        const banks = await Bank.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: banks });
    } catch (err) {
        console.error('getLinkedBanks error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.removeBank = async (req, res) => {
    try {
        const bank = await Bank.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!bank) return res.status(404).json({ success: false, error: 'Bank not found' });
        res.status(200).json({ success: true, message: 'Bank removed successfully' });
    } catch (err) {
        console.error('removeBank error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
