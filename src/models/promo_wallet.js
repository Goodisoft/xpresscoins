
const mongoose = require('mongoose');
const { Decimal128 } = require('bson');


const promoSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    total_earning: {
        type: Decimal128,
    },
    investment_amount: {
        type: Decimal128,
    },

    promo_title: {
        type: String,
    },

    cashout_date: {
        type: Date,
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


const PromoWallet = mongoose.model('promo-wallet', promoSchema);

module.exports = PromoWallet; 