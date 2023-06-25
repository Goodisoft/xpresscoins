
module.exports.errorHandler = (e) => {

    let error = {username: '', email: ''}
    let loginError = '';
    let passwordError = '';

    
    // console.log(e.message)
    // Get the error code from the error object
    if (e.code === 11000) {
        if (e.message.includes('username_1 dup key:')) {
            error.username = 'Username already exist';
        }

        if (e.message.includes('email_1 dup key:')) {
            error.email= 'Email already exist'; 
        }
    }

    // Handle login error 
    // console.log(e.message)
    if (e.message === 'Incorrect email' || e.message === 'Incorrect password') {
         loginError = 'Incorrect username or password';
    }

     // Incorrect password when trying to change password
     if (e.message === 'Incorrect old password') {
        passwordError = "Old password is incorrect";
    }
    
    return {error, loginError, passwordError}
}

