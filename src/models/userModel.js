

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Referral schema
const referralSchema = new mongoose.Schema({
    direct_referral: String,
    level1_code: String,
});


// user schema
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, 'This field is required']
    },
    username: {
        type: String,
        required: [true, 'The field is required'], 
        unique: [true, 'Username already exist']
    },
    email: {
        type: String,
        required: [true, 'This field is required'],
        unique: [true, 'Email address already exist']
    },
    
    referral: referralSchema,
    
    code: {
        type: String,
    },

    withdraw_password: {
        type: String
    },

    password: {
        type: String,
        required: [true, 'This field is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false 
    },
    isBlock: {
        type: Boolean,
        default: false 
    },
    date_join: {
        type: Date,
        default: Date.now 
    }
});

// Hash password before a new user is saved to the db 
userSchema.pre('save', async function(next){
    // Function runs before a document is save to the db
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login a user
userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({username});
    // CHeck if user exist
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;