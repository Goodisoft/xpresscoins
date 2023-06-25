

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {encryptData, validate, generateToken, generateCode} = require('../helpers/validateData');
const { errorHandler } = require('../helpers/handleError');

// Import models
const User = require('../models/userModel');

const {sendEmail} = require('../helpers/send_mail');
const MiningWallet = require('../models/mining_wallet');



module.exports = {

    post_sign_up: async (req, res) =>{

        let {full_name, username, email, referral_code, password, confirm_pass} = req.body;

        //  the trime the wide spaces
        full_name = full_name.trim();
        username = username.trim();
        email = email.trim();
        let direct_referral = referral_code.trim();
        password = password.trim();
        confirm_pass = confirm_pass.trim();
        
        // Validate first name input
        // Regex pattern
        let full_name_pattern = /^[a-zA-Z\s]+$/;
        // Check if the field is empty
        if (full_name.length < 1) {
            return res.status(400).json({error: 'This field is required'});
        }
        if (full_name.length > 50) {
            return res.status(400).json({error: 'First name is longer than expected'});
        }
        let errMsg = 'Name should not contain special character';
        // Regex Validator function
        let name_validator = validate(full_name, full_name_pattern);
        if (!name_validator.errors['isValid']) {
            return res.status(400).json({error: errMsg});
        }


        // Validate phone number 
        // Regex pattern
        let username_pattern = /^[a-zA-Z0-9]+$/;
        // Check if the field is empty
        if (username.length < 1) {
            return res.status(400).json({error: 'This field is required'});
        }
        // Regex Validator function
        let username_validator = validate(username, username_pattern);
        if (!username_validator.errors['isValid']) {
            return res.status(400).json({error: 'Invalid username format'});
        }


        // Validate email field 
        // Regex pattern
        let email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // Check if the field is empty
        if (email.length < 1) {
            return res.status(400).json({error: 'This field is required'});
        }
        if (email.length > 80) {
            return res.status(400).json({error: 'Email length is longer than expected'});
        }
        // Regex Validator function
        let email_validator = validate(email, email_pattern);
        if (!email_validator.errors['isValid']) {
            return res.status(400).json({error: 'Invalid email address'});
        }

        // Validate the referral field 
        if (direct_referral.length > 20) {
            return res.status(400).json({error: 'Invalid referral code'});
        }
        

        
        // Validate password field 
        // Regex pattern
        let password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        // Check if the field is empty
        if (password.length < 1) {
            return res.status(400).json({error: 'This field is required'});
        }
        if (password.length > 30) {
            return res.status(400).json({error: 'Password length is longer than expected'});
        }
        // Regex Validator function
        let password_validator = validate(password, password_pattern);
        if (!password_validator.errors['isValid']) {
            return res.status(400).json({error: 'Wrong password format'});
        }

        // Validate confirmPass field 
        if (confirm_pass !== password) {
            return res.status(400).json({error: 'Password does not match'});
        }

        try {

            let level1_code = "";

            // Check referral
            if (direct_referral !== '') {

                let u = await User.findOne({code: direct_referral});
                // Set the first upline referral code
                level1_code = u.referral.direct_referral;
                
            }
            // console.log('Direct referral out: ', level1_code);

            // Generate unique code 
            // let code = generateCode();
            // console.log(code);


            // Insert the to the database
            const _user = await User.create({
                full_name, username, email, 
                referral: {direct_referral, level1_code}, 
                code: username, password
            });
            // console.log(_user);

            //  Notify the admin
            sendEmail(
                process.env.EMAIL_USER, 
                process.env.EMAIL_USER,
                'New Registration Notification',
                `A client with username ${username} and email ${email} just register in your app`
            );

            // Create wallet
            let wallet = await MiningWallet.create({user: _user._id, balance: '0'});
            // console.log('Wallet has been created: ', wallet);
            // Gets the options from env
            signOptions = {
                expiresIn: process.env.EXPIRED_IN, 
                algorithm: process.env.ALGORITHM
            }

            // Data to be sign 
            dataOptions = {
                tracking_id: _user._id
            }
            // Generate the token
            let token = generateToken(dataOptions, process.env.SECRET_KEY, signOptions);
            // console.log(token);


            // Encryption key 
            const key = crypto.scryptSync(process.env.EN_PASS, process.env.EN_SALT, 24); //create key
            // Encrypt the token
            let EncryptedToken = encryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, token);
            // console.log(EncryptedToken)

            // Send the token  to the browser
            res.cookie('JWT', EncryptedToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            
            sendEmail( 
                email, username,
                "Email Confirmation",
                `Your registration is successful. Account details are as follows; Name: ${full_name}, Email: ${email}, Username: ${username}, Password: ${password}. Please click on the button below to confirm your account` 
            );
            
            return res.status(200).json({user: _user.full_name});

        } catch (err) {
            // console.log(err.message)
            let {error} = errorHandler(err);
            return res.status(400).json({error}); 
        }
    },

    // Handle login
    post_login: async (req, res) => {
        let {username, password} = req.body;

         // Validate username field 
        // Regex pattern
        let username_pattern = /^[a-zA-Z\s]/;
        // Check if the field is empty
        if (username.length < 1) {
            return res.status(400).json({error: 'All fields are required'});
        }
        if (username.length > 50) {
            return res.status(400).json({error: 'username length is longer than expected'});
        }
        // Regex Validator function
        let username_validator = validate(username, username_pattern);
        if (!username_validator.errors['isValid']) {
            return res.status(400).json({error: 'Invalid username format'});
        }

        // Validate password field 
        // Regex pattern
        let password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        // Check if the field is empty
        if (password.length < 1) { 
            return res.status(400).json({error: 'All fields are required'});
        }
        if (password.length > 30) {
            return res.status(400).json({error: 'Password length is longer than expected'});
        }
        // Regex Validator function
        let password_validator = validate(password, password_pattern);
        if (!password_validator.errors['isValid']) {
            return res.status(400).json({error: 'Wrong password format'});
        }

        try {
            let _user = await User.login(username, password);

            _user.password = undefined;
  
            // Gets the options from env
            signOptions = {
                expiresIn: process.env.EXPIRED_IN, 
                algorithm: process.env.ALGORITHM
            }

            // Data to be sign 
            dataOptions = {
                tracking_id: _user._id
            }
            
            //Generate jwt token
            let token = generateToken(dataOptions, process.env.SECRET_KEY, signOptions);
            // console.log('Token', token)
            //  Encrypt the token
            // Encryption key 
            const key = crypto.scryptSync(process.env.EN_PASS, process.env.EN_SALT, 24); //create key
            let EncryptedToken = encryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, token);
            // console.log('Encrypted token: ', EncryptedToken)

            // Send the token  to the browser
            res.cookie('JWT', EncryptedToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});

            // CHecks if the login user is an admin
            // console.log(_user.isAdmin) 
            
           
            res.status(200).json({ user:_user.isAdmin });   
            // return res.redirect('user/account');

        } catch (err) {
            // console.log(err);
            const {loginError} = errorHandler(err);
            // console.log(loginError);

            res.status(400).json({ error: loginError })
        } 
    },

    logout: (req, res) =>{
        res.cookie('JWT', '', {maxAge: 1});
        res.redirect('/sign-in');
    }

}