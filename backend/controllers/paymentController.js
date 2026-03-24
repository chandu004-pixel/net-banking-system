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
        console.error("Razorpay Create Order Error:", err);
        const errMsg = err.error ? err.error.description : err.message || JSON.stringify(err);
        res.status(500).json({ error: "Razorpay Error: " + errMsg });
    }
};

// SIMULATE FUNDING (Bypass Razorpay KYC)
exports.simulateFunding = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'user not found' });

        const tx = new Transaction({
            user: user._id, amount: Number(amount), type: 'deposit', status: 'completed'
        });
        await tx.save();

        await createLedgerEntry(user, tx, 'credit', Number(amount), `Simulated Direct Deposit Funding`);

        res.json({ success: true, message: `Successfully funded account with ₹${amount}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to simulate funding" });
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

// --- CORE BANKING TRANSFER ROUTES ---

// 1. Internal Transfer (NexBank to NexBank)
exports.executeInternalTransfer = async (req, res) => {
    try {
        const { amount, recipientAccount } = req.body;
        const senderId = req.user.userId;

        if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

        const sender = await User.findById(senderId);
        if (sender.balance < amount) return res.status(400).json({ error: "Insufficient functional balance" });
        if (sender.accountNumber === recipientAccount) return res.status(400).json({ error: "Cannot transfer to yourself" });

        const recipient = await User.findOne({ accountNumber: recipientAccount });
        if (!recipient) return res.status(404).json({ error: "Recipient NexBank Account not found" });

        // Sender Transaction
        const txOut = new Transaction({ user: sender._id, amount, type: 'transfer_internal', status: 'completed', recipientName: recipient.name, recipientAccount });
        await txOut.save();
        await createLedgerEntry(sender, txOut, 'debit', amount, `Internal TRF to ${recipient.name} (Acc: ${recipientAccount})`);

        // Recipient Transaction
        const txIn = new Transaction({ user: recipient._id, amount, type: 'transfer_internal', status: 'completed', recipientName: sender.name, recipientAccount: sender.accountNumber });
        await txIn.save();
        await createLedgerEntry(recipient, txIn, 'credit', amount, `Internal TRF from ${sender.name} (Acc: ${sender.accountNumber})`);

        res.json({ success: true, message: "Internal Transfer Successful. No fees charged." });
    } catch (err) {
        res.status(500).json({ error: "Internal transfer failed" });
    }
};

// 2. Domestic Transfer (IMPS / NEFT)
exports.executeDomesticTransfer = async (req, res) => {
    try {
        const { amount, recipientName, recipientAccount, recipientIfsc } = req.body;
        const senderId = req.user.userId;
        const fee = 5; // Flat ₹5 IMPS Fee

        if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

        const sender = await User.findById(senderId);
        const totalDebit = Number(amount) + fee;
        if (sender.balance < totalDebit) return res.status(400).json({ error: "Insufficient balance (including ₹5 IMPS fee)" });

        // Simulate Outbound Transfer
        // TODO: Integrate RazorpayX Payouts API here to route physical NEFT transfer using Escrow/Nodal Account.
        const tx = new Transaction({
            user: sender._id, amount, type: 'transfer_domestic', status: 'completed', feeCharged: fee, 
            recipientName, recipientAccount, recipientIfsc
        });
        await tx.save();
        await createLedgerEntry(sender, tx, 'debit', totalDebit, `IMPS TRF to ${recipientName} (IFSC: ${recipientIfsc}) + ₹5 Fee`);

        res.json({ success: true, message: "Domestic IMPS Transfer initiated successfully." });
    } catch (err) {
        res.status(500).json({ error: "Domestic transfer failed" });
    }
};

// 3. FX Pricing Engine
const FX_RATES = { USD: 83.50, EUR: 90.10, GBP: 105.20 };
exports.calculateFX = async (req, res) => {
    try {
        const { amount, targetCurrency } = req.body; // amount is in INR
        if (!FX_RATES[targetCurrency]) return res.status(400).json({ error: "Unsupported currency corridor" });

        const crossRate = FX_RATES[targetCurrency];
        const flatFee = 50; // NexBank transparent flat fee
        
        const amountAfterFee = Number(amount) - flatFee;
        if (amountAfterFee <= 0) return res.status(400).json({ error: "Amount too low to cover ₹50 transmission fee" });

        const targetAmount = (amountAfterFee / crossRate).toFixed(2);
        
        res.json({
            success: true,
            originalAmount: amount,
            fee: flatFee,
            convertedAmountInr: amountAfterFee,
            exchangeRate: crossRate,
            targetCurrency,
            targetAmount
        });
    } catch (err) {
        res.status(500).json({ error: "FX Engine failed" });
    }
};

// 4. International Remittance (SWIFT)
exports.executeInternationalTransfer = async (req, res) => {
    try {
        const { amount, recipientName, recipientIban, recipientSwift, targetCurrency } = req.body;
        const senderId = req.user.userId;

        if (!FX_RATES[targetCurrency]) return res.status(400).json({ error: "Unsupported currency" });
        if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

        const sender = await User.findById(senderId);
        if (sender.balance < amount) return res.status(400).json({ error: "Insufficient functional balance" });

        const crossRate = FX_RATES[targetCurrency];
        const flatFee = 50;
        const targetAmount = ((Number(amount) - flatFee) / crossRate).toFixed(2);

        // TODO: Hook this to Currencycloud / Wise Platform API to route physical FX payout when launching in prod.
        const tx = new Transaction({
            user: sender._id, amount: Number(amount) - flatFee, type: 'transfer_international', status: 'completed',
            recipientName, recipientAccount: recipientIban, recipientIfsc: recipientSwift,
            destinationCurrency: targetCurrency, exchangeRateApplied: crossRate, feeCharged: flatFee
        });
        await tx.save();

        await createLedgerEntry(sender, tx, 'debit', amount, `SWIFT REMITTANCE to ${recipientIban} (${targetCurrency} ${targetAmount})`);

        res.json({ success: true, message: `International Remittance to ${recipientName} processed successfully.` });
    } catch (err) {
        res.status(500).json({ error: "International transfer failed" });
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