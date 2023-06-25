
const mongoose = require('mongoose');


const reinvestmentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    amount: {
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

const Reinvestment = mongoose.model('reinvestment', reinvestmentSchema);

module.exports = Reinvestment;