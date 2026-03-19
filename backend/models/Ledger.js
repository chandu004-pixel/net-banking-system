const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balanceBefore: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    description: String,
    metadata: {
        type: Map,
        of: String
    }
}, { timestamps: true });

// Ensure ledger is append-only by preventing updates/deletes via middleware if needed, 
// but for now, we'll just follow the pattern in controllers.

module.exports = mongoose.model('Ledger', ledgerSchema);
