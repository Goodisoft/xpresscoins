
const mongoose = require('mongoose');
const { Decimal128 } = require('bson');


const refPaidOutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    paid_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'referral_withdrawal'
    },
    amount: {
        type: Decimal128,
    },
   
});


const ReferralPaidOut = mongoose.model('referral_paid_out', refPaidOutSchema);

module.exports = ReferralPaidOut;