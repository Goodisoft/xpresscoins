
const mongoose = require('mongoose');

// Deposit schema

const miningWithdrawalSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    currency: {
        type: String, 
    },
    amount: {
        type: Number,
    },
    address: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    mining_completed: {
        type: Boolean,
        default: false
    },
    withdrawal_date: {
        type: Date,
        default: Date.now
    }
});


const MiningWithdrawal = mongoose.model('mining_withdrawal', miningWithdrawalSchema);

module.exports = MiningWithdrawal;