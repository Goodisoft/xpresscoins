
// Get the form attributes
let forgottern_pwd_form = document.getElementById('forgottern_pwd_form');



    // Post the form data
forgottern_pwd_form.addEventListener('submit', (e) =>{
        e.preventDefault();

        
    // Get the error div
    let emailErr = document.querySelector('.emailErr');

    let email = forgottern_pwd_form.email.value;


    emailErr.textContent = '';

        if (email.length === '') {
            emailErr.textContent = 'This filed is required';
            emailErr.style.color = 'red';
            throw Error('Terminate execution');
        }

        fetch('/forgottern-password', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify({email}) 
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success) {
                $(document).ready(() =>{
                    $('.toast-body').html(data.success);
                    $('.toast').css('background-color', 'rgb(13, 152, 186, .8)');
                    $('.toast').toast('show');
                });
    
                setInterval(() => {
                    window.location.href = '/sign-in';
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