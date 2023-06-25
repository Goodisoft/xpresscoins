
const Plan = require('../models/plan');
const User = require('../models/userModel');
const {validate} = require('../helpers/validateData');
const {sendEmail} = require('../helpers/send_mail');
const bcrypt = require('bcrypt');

module.exports = {

    index: async (req, res) => {

        let context = {};

        try {
            // Get the referral
            if (req.query.ref_link !== undefined) {
                context['referral_code'] = req.query.ref_link;
            }
            else{
                context['referral_code'] = '';
            }
            
            // Gets the investment plans
            const plans = await Plan.find({}, {user:0});
            // console.log(plans);
            context['plans'] = plans;

            return res.render('./index', {context});

        } catch (error) {
            // console.log(error);
        }
    },
     
    get_login: (req, res) => {
        return res.render('./sign_in');
    },

    get_register: (req, res) => {

        let context = {};

        console.log(req.query.ref_link)
        // Get the referral
        if (req.query.ref_link) {
            context['referral_code'] = req.query.ref_link;
        }
        else{
            context['referral_code'] = '';
        }

        return res.render('./sign_up', {context});
    },

    get_terms_conditions: (req, res) =>{
        return res.render('./terms_conditions');
    },

    about: (req, res) =>{
        return res.render('./about');
    },

    contact: (req, res) =>{
        return res.render('./contact');
    },
    services: (req, res) =>{
        return res.render('./services');
    },
    get_faqs: (req, res) =>{
        return res.render('./faqs');
    },

    get_plan: async (req, res) =>{
        const context = {};
        try {
            // Gets the investment plans
            const plans = await Plan.find({}, {user:0});
            // console.log(plans);
            context['plans'] = plans;
            return res.render('./plans', {context});

        } catch (error) {
            console.log(error);
        }
    },
   
    forgottern_password: (req, res) =>{
        return res.render('./forgottern_password');
    },

    post_forgottern_password: async (req, res) =>{
        const {email} = req.body;

        try {
            let email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
       
            // Regex Validator function
            let email_validator = validate(email, email_pattern);
            if (!email_validator.errors['isValid']) {
                throw new Error('Invalid email address');
            }

            const user = await User.findOne({email});
            
            if (user === null) {
                throw new Error('User not found');
            }

            // send change password link 
            sendEmail(
                email, 
                email, 
                'Reset Password',
                `Click on the link below to reset your password. If you didn\'t trigger this action, please login and change your password.  
                https://eklipsecoins.com/reset-password?uid=${user._id}`
            )
            return res.status(200).json({success: 'Password reset link has been sent to your email inbox'});
        } catch (error) {
            return res.status(501).json({error: error.message});
        }
    },

    get_reset_password: async (req, res) => {
        const context = {};
        context['uid'] = req.query.uid;
        return res.render('./reset_password', {context});
    },

    // Post update password
    post_update_password: async(req, res) =>{
        const {uid, new_password, confirm_password} = req.body;

        // Validate password field 
        // Regex pattern
        let password_pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
   
       
        //  Checks whether the old password ids correct
        try {
             // Regex Validator function
            let password_validator = validate(new_password, password_pattern);
            if (!password_validator.errors['isValid']) {
                throw new Error('Invalid password format');
            }

            // Validate confirmPass field 
            if (confirm_password !== new_password) {
                throw new Error('Password do not match');
            }

            if (uid.length < 2) {
                throw new Error('Internal server error. Please try again');
            }

            const user = await User.findById(uid);

            if (user) {
                const salt = await bcrypt.genSalt();
                const hashPassword = await bcrypt.hash(new_password, salt);
                // console.log(hashPassword)
                const u = await User.findOneAndUpdate({ _id: uid }, { password: hashPassword });
                // console.log(u);
                let success = 'Password change sucessfully'; 
                return res.status(200).json({success});   
            }
            throw new Error('User does not exist');


        } catch (err) {
            console.log(err);
            return res.status(501).json({error: err.message});   

        }
    }, 
}