
const add_wallet_form = document.getElementById('add_wallet_form');

add_wallet_form.addEventListener('submit', (e) =>{

    e.preventDefault();
    
    // Get error divs
    let currencyErr = document.getElementById('currencyErr');
    let walletErr = document.getElementById('walletErr');

    // Rest the errors
    currencyErr.innerHTML = '';
    walletErr.innerHTML = '';

    const currency = add_wallet_form.currency.value;
    const wallet_address = add_wallet_form.wallet_address.value;


    if (currency  === '') {
        currencyErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    if (wallet_address.length < 1) {
        walletErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    
    const data = {currency, wallet_address};

    fetch('/account/add-wallet', {
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