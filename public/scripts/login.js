
// Get the form attributes
let login_form = document.getElementById('login_form');



    // Post the form data
login_form.addEventListener('submit', (e) =>{
        e.preventDefault();

        
    // Get the error div
    let usernameErr = document.querySelector('.usernameErr');
    let passwordErr = document.querySelector('.passwordErr');

    let username = login_form.username;
    let password = login_form.password;


    usernameErr.textContent = '';
    passwordErr.textContent = '';

        if (username.value.length < 1) {
            usernameErr.textContent = 'This filed is required';
            usernameErr.style.color = 'red';
            throw Error('Terminate execution');
        }

         //  Check if the field is empty
        if (password.value.length < 2) {
            passwordErr.textContent = 'This filed is required';
            passwordErr.style.color = 'red';
            passwordErr.style.textAlign = 'left';
            throw Error('Terminate execution');
        }

        let data =  {username: username.value, password: password.value};

        fetch('/auth/sign-in', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify(data) 
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.user) {
                $(document).ready(() =>{
                    $('.toast-body').html('Login success');
                    $('.toast').css('background-color', 'rgb(13, 152, 186, .8)');
                    $('.toast').css('padding', '4px');
                    $('.toast').toast('show');
                });
    
                setInterval(() => {
                    window.location.href = '/account/home';
                }, 1000);
            }
            else if(data.user === false){

                $(document).ready(() =>{
                    $('.toast-body').html('Login success');
                    $('.toast').css('background-color', 'rgb(13, 152, 186, .8)');
                    $('.toast').toast('show');
                });
    
                setInterval(() => {
                    window.location.href = '/user/account';
                }, 1000);
            }
            // Check server errors
            else if (data.error) {
                $(document).ready(() =>{
                    $('.toast-body').html(data.error);
                    $('.toast').css('background-color', '#da2c46');
                    $('.toast').toast('show');
                });
            }
        })
        .catch(e => {
            console.log(e)
        })
        
})