
const mongoose = require('mongoose');
const { Decimal128 } = require('bson');


const paidOutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    currency: {
        type: String,
    },
    amount: {
        type: Decimal128,
    },
    withdrawal_date: {
        type: Date,
        default: Date.now
    }
   
});


const PaidOut = mongoose.model('paid_out', paidOutSchema);

module.exports = PaidOut;