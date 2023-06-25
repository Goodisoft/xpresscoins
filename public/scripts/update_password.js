
const update_password_form = document.getElementById('update_password_form');

update_password_form.addEventListener('submit', (e) =>{

    e.preventDefault();
    
    // Get error divs
    let oldPassErr = document.getElementById('oldPassErr');
    let newPassErr = document.getElementById('newPassErr');
    let confirmPassErr = document.getElementById('confirmPassErr');

    // Rest the errors
    oldPassErr.innerHTML = '';
    newPassErr.innerHTML = '';
    confirmPassErr.innerHTML = '';

    const old_password = update_password_form.old_password.value;
    const new_password = update_password_form.new_password.value;
    const confirm_password = update_password_form.confirm_password.value;


    if (old_password.length < 1) {
        oldPassErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    if (new_password.length < 1) {
        newPassErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    if (confirm_password !== new_password) {
        confirmPassErr.innerHTML = 'Password does not match';
        throw Error('Terminate process');
    }
    
    const data = {old_password, new_password, confirm_password};

    fetch('/user/update-password', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(data) 
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data);

        if (data.success) {
            $(document).ready(() =>{
                $('.toast-body').html(data.success);
                $('.toast').css('background-color', 'rgb(13, 152, 186, .8)');
                $('.toast').toast('show');
            });

            setInterval(() => {
                window.location.href = '/auth/logout';
            }, 1000);
        }
       
        // Check server errors
        if (data.error) {
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red');
                $('.toast').toast('show');
            });

        }
    })
    .catch(e => {
        console.log(e)
    })


})