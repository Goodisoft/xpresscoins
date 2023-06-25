
//  import jsonwebtoken module
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

// IMport the ddecryption function
const {decryptData} = require('../src/helpers/validateData');

const User = require('../src/models/userModel');

const auth = (req, res, next) =>{

    // Get the encrypted token from cookies
    const encryptedToken = req.cookies.JWT;
    // console.log(encryptedToken);
    if (encryptedToken === undefined) {
        return res.redirect('/sign-in');
    }
    // Encryption key 
    const key = crypto.scryptSync(process.env.EN_PASS, process.env.EN_SALT, 24); //create key
    // Decrypt the token
    let token = decryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, encryptedToken);
    // console.log(token);
    
    // check if token exist and verify
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) =>{
            if (err) {
                // console.log(err.message);

                // console.log(decodedToken.exp*1000);
                // console.log(Date.now())

                if (err.message === 'jwt expired') {
                    return res.redirect('/sign-in'); 
                }
                
                return res.redirect('/sign-in'); 
            }
            else{
                // console.log(decodedToken);
                req.user = {id: decodedToken.tracking_id};
                next();
            }
        })
    }
    else{
        
        return res.redirect('/sign-in');
    }
}

const isAdmin = (req, res, next) =>{

    // Get the encrypted token from cookies
    const encryptedToken = req.cookies.JWT;
    // console.log(encryptedToken);
    if (encryptedToken === undefined) {
        return res.redirect('/sign-in');
    }
    // Encryption key 
    const key = crypto.scryptSync(process.env.EN_PASS, process.env.EN_SALT, 24); //create key
    // Decrypt the token
    let token = decryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, encryptedToken);
    // console.log(token);

    // check if token exist and verify
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                // console.loge(err.message);
                
                if (err.message === 'jwt expired') {
                    return res.redirect('/sign-in'); 
                }
                
                return res.redirect('/sign-in'); 
            } else {
                // console.log(decodedToken);
                // Get the user by id
                let user = await User.findById(decodedToken.tracking_id);
                if (user) {
                    user.password = undefined; // Set the password to undefined

                    if (!user.isAdmin) {
                        //console.log('Not an admin');
                        res.redirect('/sign-in');
                        // next()
                    }
                    next();
                }
            }
        }) // end of jwt verification
    } else {
        res.redirect('/sign-in');
        next();
    }
}

// Check the current or login user
const checkUser =  (req, res, next) =>{
    
    
    // Get the encrypted token from cookies
    const encryptedToken = req.cookies.JWT;
    // console.log(encryptedToken);

    if (encryptedToken === undefined) {
        return res.redirect('/sign-in');
    }
    // Encryption key 
    const key = crypto.scryptSync(process.env.EN_PASS, process.env.EN_SALT, 24); //create key
    // Decrypt the token
    let token = decryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, encryptedToken);
    // console.log('Token: ', token);

    // check if token exist and verify
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) =>{ 
            if (err) {
                // console.loge(err.message);
                
                if (err.message === 'jwt expired') {
                    return res.redirect('/sign-in'); 
                }
                
                return res.redirect('/sign-in'); 
            }
            else{
            //    console.log('Decode: ', decodedToken);
               // Get the student by id
                let user = await User.findById(decodedToken.tracking_id);
                // console.log(user)
               
                if (user === null) {
                    return res.redirect('/sign-in');  
                }
                
                if (user) {
                    user.password = undefined; // Set the password to undefined
                    
                }
                res.locals._user = user;
                next();
            }
        })
    }
    else{
        res.locals._user = null; 
        next();
        // return res.redirect('/sign-in');
    }
}



module.exports = {auth, isAdmin, checkUser}