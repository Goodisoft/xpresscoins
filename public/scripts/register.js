
  

// Process the form
let signupForm = document.getElementById('register_form');

// Add event listener to the form
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gets the form attributes and data
    const full_name = signupForm.full_name.value;
    const username = signupForm.username.value;
    const email = signupForm.email.value;
    const referral_code = signupForm.referral_code.value;
    const password = signupForm.password.value;
    const confirm_pass = signupForm.confirm_pass.value;
    const termsCheck = signupForm.termsCheck;
    
    // Gert the error fields
    const nameErr = document.querySelector('.name-error');
    const usernameErr = document.querySelector('.username-error');
    const emailErr = document.querySelector('.email-error');
    const referralErr = document.querySelector('.referral-error');
    const passwordErr = document.querySelector('.password-error');
    const confirmPassErr = document.querySelector('.confirmPass-error');
    const termsErr = document.querySelector('.terms-error');
    const toast = document.querySelector('.toast');

    // Clear the error messages
    nameErr.textContent = '';
    usernameErr.textContent = '';
    emailErr.textContent = '';
    referralErr.textContent = '';
    passwordErr.textContent = '';
    confirmPassErr.textContent = '';
    termsErr.textContent = '';

    const full_name_pattern = /^[a-zA-Z\s]+$/;
    const username_pattern = /^[a-zA-Z0-9]+$/;
    const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!full_name_pattern.test(full_name) || full_name ==='') {
        nameErr.textContent = 'Invalid name format';
        throw Error('Terminate');
    }
    if (!username_pattern.test(username) || username ==='') {
        usernameErr.textContent = 'Invalid username';
        throw Error('Terminate');
    }
    if (!email_pattern.test(email) || email ==='') {
        emailErr.textContent = 'Invalid email';
        throw Error('Terminate');
    }
    if (!password_pattern.test(password) || password ==='') {
        passwordErr.textContent = 'Password Should contain Uppercase, lowercase and a digit';
        throw Error('Terminate');
    }
    if (!password_pattern.test(confirm_pass) || confirm_pass !== password) {
        confirmPassErr.textContent = 'Password Should contain Uppercase, lowercase and a digit';
        throw Error('Terminate');
    }


    // Form data in object format
    let data = {full_name, username, email, referral_code, password, confirm_pass}
    console.log(data)

    fetch('/auth/sign-up', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(data) 
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data.error);

        if (data.user) {
            $(document).ready(() =>{
                $('.toast-body').html('Account created successfully');
                $('.toast').css('background-color', 'rgb(13, 152, 186, .8)');
                $('.toast').css('padding', '4px');
                $('.toast').toast('show');
            });

            setInterval(() => {
                window.location.href = '/sign-in';
            }, 1000);
        }
        // server response
        if (data.error.username) {
            usernameErr.innerHTML = data.error.username;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error.username);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(usernameErr).show();
            })
        }

        if (data.error.email) {
            emailErr.innerHTML = data.error.email;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error.email);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(emailErr).show();
            })
        }

        if (data.error === 'This field is required' || data.error === 'First name is longer than expected' || data.error === 'Name should not contain special character') {
            nameErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(nameErr).show();
            })
        }

        if (data.error === 'This field is required' || data.error === 'Username length is longer than expected' || data.error === 'Invalid username') {
            usernameErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(phoneErr).show();
            })
        }

        if (data.error === 'This field is required' || data.error === 'Email length is longer than expected' || data.error === 'Invalid email address') {
            emailErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(emailErr).show();
            })
        }

        if (data.error === 'Invalid referral code') {
            referralErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(referralErr).show();
            })
        }

        if (data.error === 'This field is required' || data.error === 'Password length is longer than expected' || data.error === 'Wrong password format') {
            passwordErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(passwordErr).show();
            })
        }

        if (data.error === 'Password does not match') {
            confirmPassErr.innerHTML = data.error;
            // Invoke the toast component
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
                $(confirmPassErr).show();
            })
        }

    }).catch((err) =>{
        console.log(err.error);
    })
    
    
})

