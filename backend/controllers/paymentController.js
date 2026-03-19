const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require("dotenv");
const Transaction = require('../models/transaction');
const User = require('../models/User');
const Ledger = require('../models/Ledger');
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Helper for Ledger Entry
const createLedgerEntry = async (user, tx, type, amount, description) => {
    const entry = new Ledger({
        user: user._id,
        transaction: tx._id,
        type,
        amount,
        balanceBefore: user.balance,
        balanceAfter: type === 'credit' ? user.balance + amount : user.balance - amount,
        description
    });
    await entry.save();
    user.balance = entry.balanceAfter;
    await user.save();
};

// CREATE ORDER
exports.createorder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'user not found' });

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        const tx = new Transaction({
            user: user._id,
            amount: Number(amount),
            type: 'deposit',
            status: 'pending',
            razorpayOrderId: order.id
        });
        await tx.save();
        res.json({ order, txId: tx._id, key: process.env.RAZORPAY_KEY_ID })
    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
};

// VERIFY PAYMENT (With Double-Entry Ledger)
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, txId } = req.body;
        const genarate_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (genarate_signature !== razorpay_signature) {
            await Transaction.findByIdAndUpdate(txId, { status: 'failed' });
            return res.status(400).json({ error: 'invalid signature' });
        }
        
        const tx = await Transaction.findById(txId);
        if (!tx) return res.status(404).json({ error: 'transaction not found' });
        if (tx.status === 'completed') return res.json({ message: 'already processed' });

        const user = await User.findById(tx.user);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Immutable Ledger Entry first, then update status
        await createLedgerEntry(user, tx, 'credit', tx.amount, `Deposit via Razorpay (ID: ${razorpay_payment_id})`);
        
        tx.status = 'completed';
        tx.razorpayPaymentId = razorpay_payment_id;
        tx.razorpaySignature = razorpay_signature;
        await tx.save();

        res.json({ message: 'Payment verified and ledger updated' });
    } catch (err) {
        res.status(500).json({ error: "Payment verification failed" });
    }
}

// WITHDRAW (With AML Fraud Detection & Ledger)
exports.withdraw = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'user not found' });
        const numeric = Number(amount);
        
        let tx = new Transaction({
            user: user._id,
            amount: Math.abs(numeric),
            type: numeric < 0 ? 'deposit' : 'withdraw', // Support bank simulation
            status: 'pending'
        });

        // AML Logic: Brand-new user receiving > 5000 and withdrawing immediately
        const accountAgeInMs = Date.now() - new Date(user.createdAt).getTime();
        const twoMinutes = 2 * 60 * 1000;
        
        if (numeric > 5000 && accountAgeInMs < twoMinutes) {
            tx.status = 'frozen';
            tx.isFrozen = true;
            tx.fraudReason = 'High-value withdrawal by new account (< 2min age)';
            await tx.save();
            return res.status(403).json({ 
                error: 'Transaction Frozen for AML Review', 
                reason: tx.fraudReason 
            });
        }

        // Standard balance check
        if (numeric > 0 && user.balance < numeric) return res.status(400).json({ error: 'insufficient balance' });

        // Ledger + Balance Sync
        await createLedgerEntry(user, tx, numeric < 0 ? 'credit' : 'debit', Math.abs(numeric), `Wallet ${numeric < 0 ? 'top-up' : 'withdrawal'}`);

        tx.status = 'completed';
        await tx.save();
        res.json({ message: numeric < 0 ? "Bank transfer pulled successfully" : "Withdrawal processed", tx });
    } catch (err) {
        res.status(500).json({ error: "Withdrawal failed" });
    }
};

// GET ALL FROZEN TRANSACTIONS (Admin Only)
exports.getFrozenTransactions = async (req, res) => {
    try {
        const frozen = await Transaction.find({ status: 'frozen' }).populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: frozen });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch frozen transactions" });
    }
};

// RESOLVE FROZEN TRANSACTION (Admin Only)
exports.resolveFrozenTransaction = async (req, res) => {
    try {
        const { txId, action } = req.body; // action: 'approve' or 'reject'
        const tx = await Transaction.findById(txId);
        if (!tx) return res.status(404).json({ error: 'Transaction not found' });
        if (tx.status !== 'frozen') return res.status(400).json({ error: 'Transaction is not frozen' });

        const user = await User.findById(tx.user);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (action === 'approve') {
            await createLedgerEntry(user, tx, tx.type === 'deposit' ? 'credit' : 'debit', tx.amount, `AML Review: Approved & Unfrozen`);
            tx.status = 'completed';
            tx.isFrozen = false;
            await tx.save();
            res.json({ message: 'Transaction approved and balance updated' });
        } else {
            tx.status = 'failed';
            tx.isFrozen = false;
            tx.fraudReason = (tx.fraudReason || '') + ' (Rejected by Admin)';
            await tx.save();
            res.json({ message: 'Transaction rejected' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Resolution failed" });
    }
};