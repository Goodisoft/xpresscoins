
const edit_balance_form = document.getElementById('edit_balance_form');

edit_balance_form.addEventListener('submit', (e) =>{

    e.preventDefault();
    
    // Get error divs
    let balanceErr = document.getElementById('balanceErr');

    // Rest the errors
    balanceErr.innerHTML = '';

    const wallet_id = edit_balance_form.wallet_id.value;
    const balance = edit_balance_form.balance.value;
    const comment = edit_balance_form.comment.value;


    if (balance  === '') {
        balanceErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    
    const data = {wallet_id, balance, comment};

    fetch('/account/edit-balance', {
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
                window.location.href = '/account/home';
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
        // console.log(e)
    })


})