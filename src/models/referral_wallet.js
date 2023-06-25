
const { Double, Decimal128 } = require('bson');

const mongoose = require('mongoose');

// Deposit schema

const referralWalletSchema = new mongoose.Schema({

    user_code: {
        type: String,
    },
    balance: {
        type: Decimal128,
    },
   
});


const ReferralWallet = mongoose.model('referral_wallet', referralWalletSchema);

module.exports = ReferralWallet;