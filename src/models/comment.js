
const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
   
});


const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;