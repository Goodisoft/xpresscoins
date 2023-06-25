
const mongoose = require('mongoose');

// Deposit schema

const confirmDepositSchema = new mongoose.Schema({

    depositor: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    deposit_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'deposit'
    },
    plan: {
        type: String,
    },
    amount: {
        type: Number,
    },

    direct_upline: {
        type: String,
    },
    upline2: {
        type: String,
    },
    direct_upline_earning: {
        type: Number,
    },
    upline2_earning: {
        type: Number,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    confirm_date: {
        type: Date,
        default: Date.now
    }
});


const confirmDeposit = mongoose.model('confirm_deposit', confirmDepositSchema);

module.exports = confirmDeposit; 