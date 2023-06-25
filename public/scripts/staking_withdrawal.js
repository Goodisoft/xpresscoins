
let withdrawal_mining = document.querySelector('.withdrawal_div');

// From the link to mining withdrawal page
let mining_withdrawal_page = document.querySelector('#mining_withdrawal_page');


// From the link to referral withdrawal page
let referral_withdrawal_page = document.querySelector('#referral_withdrawal_page');
let referral_withdraw_div = document.querySelector('.referral_withdraw_div');


    // Set onclick event to the mining withdrawal page
    mining_withdrawal_page.addEventListener('click', (e) =>{
        e.preventDefault();
        // Hide the mining withdrawal
        withdrawal_mining.style.display = 'block';
        // Hide referral withdrawal div
        referral_withdraw_div.style.display = 'none';

        // Change tab color
        mining_withdrawal_page.style.borderBottom = '3px solid #578ebe';
        mining_withdrawal_page.style.color = '#578ebe'

        referral_withdrawal_page.style.color = '#000'
        referral_withdrawal_page.style.borderBottom = '1px solid #000';


    });

    let withdrawal_amount = "";
    let wallet_address = "";
    let s_currency = "";



    // Referral withdrawal
    let referral_withdrawal_form = document.getElementById('referral_withdrawal_form');

    // Get the referral withdrawal page
    referral_withdrawal_page.addEventListener('click', (e) =>{
        e.preventDefault();
        // Hide the mining withdrawal
        withdrawal_mining.style.display = 'none';

        // Show the staking withdrawal page
        referral_withdraw_div.style.display = 'block';

        // Change tab color
        referral_withdrawal_page.style.borderBottom = '3px solid #578ebe';
        referral_withdrawal_page.style.borderBottomColor = '3px solid #578ebe';
        referral_withdrawal_page.style.color = '#578ebe'

        mining_withdrawal_page.style.color = '#000'
        mining_withdrawal_page.style.borderBottom = '1px solid #000';

    });



    // Validate referral withdrawal amount
    referral_withdrawal_form.addEventListener('submit', (e) =>{

        e.preventDefault();

        const ref_currency = referral_withdrawal_form.currency.value;
        const ref_withdrawal_amount = referral_withdrawal_form.withdrawal_amount.value;
        const address = referral_withdrawal_form.address.value;
        

        let coinErr = document.getElementById('coinErr');
        let amountErr = document.getElementById('wit_amount_err');
        let addressError = document.getElementById('addressError');



        const amountReg = /^[0-9\.]+$/;
        const testExp = new RegExp(amountReg);

        // clear Error message
        coinErr.innerHTML = '';
        amountErr.innerHTML = '';
        addressError.innerHTML = '';

        // validate the form data 
        if (!testExp.test(ref_withdrawal_amount) || ref_withdrawal_amount === '') {
            amountErr.innerHTML = 'Invalid amount';
            throw Error('Terminate process');    
        }
        if ( address === '') {
            addressError.innerHTML = 'Invalid wallet address';
            throw Error('Terminate process');    
        }
        if ( ref_currency === '') {
            coinErr.innerHTML = 'Please select currency';
            throw Error('Terminate process');    
        }
        const data = {ref_currency, ref_withdrawal_amount, address};
         // Post data
         fetch('/user/affiliate-withdrawal', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {

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


