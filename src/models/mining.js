
const mongoose = require('mongoose');
const { Decimal128 } = require('bson');


const MiningSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    paid_out: {
        type: Decimal128,
    },
    investment_amount: {
        type: Decimal128,
    },

    active_plan: {
        type: String,
    },

    mining_unit: {
        type: String,
    },

    mining_completion_date: {
        type: Date,
    },

    isMining: {
        type: Boolean,
        default: true
    },
    confirm_date: {
        type: Date,
        default: Date.now
    }
});


const Mining = mongoose.model('mining', MiningSchema);

module.exports = Mining; 