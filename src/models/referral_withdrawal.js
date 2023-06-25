
const mongoose = require('mongoose');

// Deposit schema

const referralWithdrawalSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    currency:  {
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
    withdrawal_date: {
        type: Date,
        default: Date.now
    }
});


const ReferralWithdrawal = mongoose.model('referral_withdrawal', referralWithdrawalSchema);

module.exports = ReferralWithdrawal;