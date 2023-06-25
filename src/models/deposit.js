
const mongoose = require('mongoose');

// Deposit schema

const depositSchema = new mongoose.Schema({

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


const Deposit = mongoose.model('deposit', depositSchema);

module.exports = Deposit;