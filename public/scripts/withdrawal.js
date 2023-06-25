
let init_withdrawal = document.getElementById('init_withdrawal');

let withdrawal_div = document.querySelector('.withdrawal_div');


    // Validate deposit initialization
    init_withdrawal.addEventListener('submit', (e) =>{

        e.preventDefault();
        const currency = init_withdrawal.currency.value;
        const amount = init_withdrawal.amount.value;
        const walletAddress = init_withdrawal.walletAddress.value;

        let amountErr = document.getElementById('amountErr');
        let address_Err = document.getElementById('address_Err');
        let currency_Err = document.getElementById('currency_Err');



        let amountReg = /^[0-9\.]+$/;
        let testExp = new RegExp(amountReg);

        // clear Error message
        amountErr.innerHTML = '';
        currency_Err.innerHTML = '';
        address_Err.innerHTML = '';

        if (currency === '') {
            currency_Err.innerHTML = 'This field is required';
            throw Error('Terminate process');    
        }

        // validate the form data 
        if (!testExp.test(amount) || amountErr === '') {
            amountErr.innerHTML = 'Invalid amount';
            throw Error('Terminate process');    
        }
        // Validate the wallet address
        if (walletAddress.length < 1) {
            address_Err.innerHTML = 'This field is required';
            throw Error('Terminate process');    
        }

        let data =  {currency, amount, walletAddress};
        
       // Post data
       fetch('/user/withdraw', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
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

    });


  