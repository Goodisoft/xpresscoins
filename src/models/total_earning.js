
const mongoose = require('mongoose');

// Deposit schema

const totalEarningSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    total: {
        type: Number,
    },
   
});


const TotalEarning = mongoose.model('total_earning', totalEarningSchema);

module.exports = TotalEarning;