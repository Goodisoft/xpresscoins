
const mongoose = require('mongoose');

// Deposit schema

const miningWalletSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    balance: {
        type: Number,
    },
   
});


const MiningWallet = mongoose.model('mining_wallet', miningWalletSchema);

module.exports = MiningWallet;