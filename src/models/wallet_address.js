
const mongoose = require('mongoose');

// Deposit schema

const walletAddressSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    currency: {
        type: String,
    },
    wallet_address: {
        type: String,
    },
   
});


const WalletAddress = mongoose.model('wallet_address', walletAddressSchema);

module.exports = WalletAddress;