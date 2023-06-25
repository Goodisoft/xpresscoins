
const mongoose = require('mongoose');


const noticeSchema = new mongoose.Schema({

    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
    },
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
   
});


const Notice = mongoose.model('notice', noticeSchema);

module.exports = Notice;