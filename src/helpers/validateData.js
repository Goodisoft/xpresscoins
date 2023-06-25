
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// validate the name pattern
module.exports.validate = (data, pattern) =>{
    let errors = {isValid: false};
    // An instance of regex object
    let testExp = new RegExp(pattern);

    // Test the regular expression fron the input
    if (!testExp.test(data)) {
        errors.isValid = false;
    }
    else{
        errors.isValid = true;
    }
    return {errors};
}

module.exports.generateToken =  (dataOptions, privateKey, signOptions) =>{

    return jwt.sign(dataOptions, privateKey, signOptions);

}

    


module.exports.encryptData = (algorithm, key, iv, text) =>{
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
    // console.log(encrypted)
    return encrypted;
}
    
// let en = encryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, text);
// console.log(en)


// Decrypt the 
module.exports.decryptData = (algorithm, key, iv, encrypted) =>{
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
    // console.log(decrypted);
    return decrypted; 
}
    
// let d = decryptData(process.env.EN_ALGORITHM, key, process.env.EN_IV, encrypted);
// console.log(d)


// Generate unique code 
module.exports.generateCode = () => {
    let code =  (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
    // console.log(code.toLocaleUpperCase());

    // convert the code to uppercase
    return code.toLocaleUpperCase();
}


