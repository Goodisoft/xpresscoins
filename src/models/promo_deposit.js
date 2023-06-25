
const mongoose = require('mongoose');


const PromoDepositSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    promo: {
        type: mongoose.Schema.ObjectId,
        ref: 'promo'
    },
    currency: {
        type: String,
    },
    amount: {
        type: Number,
    },
    transaction_id: {
        type: String,
    },
    isConfirm: {
        type: Boolean,
        default: false
    },
    deposit_date: {
        type: Date,
        default: Date.now
    }
});


const PromoDeposit = mongoose.model('promo-deposit', PromoDepositSchema);

module.exports = PromoDeposit;