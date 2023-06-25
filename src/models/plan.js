
const mongoose = require('mongoose');

// Deposit schema

const planSchema = new mongoose.Schema({

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
   
});


const Plan = mongoose.model('plan', planSchema);

module.exports = Plan;