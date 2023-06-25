const reinvet_form = document.getElementById('reinvet_form');

reinvet_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = reinvet_form.amount.value;
    // Get the error div
    const amountErr = document.getElementById('amountErr');
    let amountReg = /^[0-9\.]+$/;


    amountErr.innerHTML = '';

    // validate the form data 
    if (!amountReg.test(amount) || amountErr === '') {
        amountErr.innerHTML = 'Invalid amount';
        throw Error('Terminate process');    
    }

     // Post data
     fetch('/user/reinvestment', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({amount})
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
                window.location.href = '/user/account';
            }, 4000);
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
        $(document).ready(() =>{
            $('.toast-body').html('Something went wrong');
            $('.toast').css('background-color', 'red');
            $('.toast').toast('show');
        });
    })

})