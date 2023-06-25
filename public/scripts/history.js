
// Get history tab buttons
let mining_deposit_btn = document.getElementById('mining_deposit_btn');
let mining_withdrawal_btn = document.getElementById('mining_withdrawal_btn');
let referral_withdrawal_btn = document.getElementById('referral_withdrawal_btn');

// Get history tables
let mining_deposit = document.querySelector('.mining_deposit');
let mining_withdrawal = document.querySelector('.mining_withdrawal');
let referral_withdrawal = document.querySelector('.referral_withdrawal');


// Show mining deposit table
mining_deposit_btn.addEventListener('click', (e) =>{

    // Show mining deposit table
    mining_deposit.style.display = 'block';
    mining_deposit_btn.style.color = '#578ebe';
    mining_deposit_btn.style.borderBottom = '3px solid #578ebe';

    mining_withdrawal.style.display = 'none';
    referral_withdrawal.style.display = 'none';
    referral_withdrawal_btn.style.color = '#000';
    mining_withdrawal_btn.style.color = '#000';
    referral_withdrawal_btn.style.borderBottom = '1px solid #000';
    mining_withdrawal_btn.style.borderBottom = '1px solid #000';

});


// Show mining withdrawal table
mining_withdrawal_btn.addEventListener('click', (e) =>{
    // Display staking table
    mining_withdrawal.style.display = 'block';
    mining_withdrawal_btn.style.color = '#578ebe';
    mining_withdrawal_btn.style.borderBottom = '3px solid #578ebe';


    // Hide other tables
    mining_deposit.style.display = 'none';
    referral_withdrawal.style.display = 'none';
    referral_withdrawal_btn.style.color = '#000';
    mining_deposit_btn.style.color = '#000';
    referral_withdrawal_btn.style.borderBottom = '1px solid #000';
    mining_deposit_btn.style.borderBottom = '1px solid #000';
});


// Show staking withdrawal table
referral_withdrawal_btn.addEventListener('click', (e) =>{

    // Display referral withdrawal table
    referral_withdrawal.style.display = 'block';
    referral_withdrawal_btn.style.color = '#578ebe';
    mining_withdrawal_btn.style.borderBottom = '3px solid #578ebe';

    
    // Hide other tables
    mining_deposit.style.display = 'none';
    mining_withdrawal.style.display = 'none';
    mining_withdrawal_btn.style.color = '#000';
    mining_deposit_btn.style.color = '#000';

    mining_withdrawal_btn.style.borderBottom = '1px solid #000';
    mining_deposit_btn.style.borderBottom = '1px solid #000';
});