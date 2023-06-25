
const mongoose = require('mongoose');

// Deposit schema

const promoSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
    },
    profit: {
        type: String,
    },
    duration: {
        type: String,
    },
    activation: {
        type: String,
    },
    isRunning: {
        type: Boolean,
        default: false
    },
   
});


const Promo = mongoose.model('promo', promoSchema);

module.exports = Promo;