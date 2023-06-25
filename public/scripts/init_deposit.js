
// Get the road map form
let init_deposit = document.getElementById('init_deposit');
let confirm_deposit = document.getElementById('confirm_deposit');

let currency = "";
let amount = "";


    // Validate deposit initialization
    init_deposit.addEventListener('submit', (e) =>{

        e.preventDefault();


        currency = init_deposit.currency.value;
        amount = init_deposit.amount.value;

        let currencyErr = document.getElementById('currencyErr');
        let amountErr = document.getElementById('amountErr');
        let deposit = document.querySelector('.deposit');
        let confirm_deposit = document.querySelector('.confirm_deposit'); 
        let display_currency = document.querySelector('.display_currency'); 
        let display_amount = document.querySelector('.display_amount'); 



        let amountReg = /^[0-9\.]+$/;
        let testExp = new RegExp(amountReg);

        // clear Error message
        currencyErr.innerHTML = '';
        amountErr.innerHTML = '';


        // validate the form data
        if (currency === '' ) {
            currencyErr.innerHTML = 'Select currency';
            throw Error('Terminate process');    
        }
        if (parseInt(amount) < 50) {
            amountErr.innerHTML = 'Minimum deposit of $40 is accepted';
            throw Error('Terminate process');    
        }
        
        if (!testExp.test(amount) || amountErr === '') {
            amountErr.innerHTML = 'Invalid amount';
            throw Error('Terminate process');    
        }


        let data =  {currency, amount};
        
        if (data.currency !== '' && data.amount !== '') {
            deposit.style.display = 'none';
            confirm_deposit.style.display = 'block';
            display_currency.innerHTML = currency;
            display_amount.innerHTML = '$'+ amount;

            // Show BTC wallet address
            if (currency === 'BTC') {
                document.querySelector('.btc_address').style.display = 'block';
            }
            // Show BNB wallet address
            if (currency === 'ETH') {
                document.querySelector('.eth_address').style.display = 'block';
            }
            // Show usdt-trc20 wallet address
            if (currency === 'USDT') {
                document.querySelector('.ltc_address').style.display = 'block';
            }
           
        }

    });


    // Post the payment 
    confirm_deposit.addEventListener('submit', (e) => {

        e.preventDefault();

        let transaction_id = confirm_deposit.transaction_id.value;
        let uploadErr = document.querySelector('.uploadErr');

        //  check if user upload field

        if (transaction_id === '') {
            uploadErr.innerHTML = 'This field is required';
            throw Error('Terminate process');
        }

        let data = {currency, amount, transaction_id};

        // Post data
        fetch('/user/deposit', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
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
                    window.location.href = '/user/account';
                }, 4000);
            }
            // Check server errors
            if (data.error) {
                $(document).ready(() =>{
                    $('.toast-body').html(data.error);
                    $('.toast').css('background-color', '#da2c46');
                    $('.toast').toast('show');
                });

            }
        })
        .catch(e => {
            $(document).ready(() =>{
                $('.toast-body').html('Something went wrong');
                $('.toast').css('background-color', '#da2c46');
                $('.toast').toast('show');
            });
        })
        
    })
