
const edit_staking_form = document.getElementById('edit_staking_form');

edit_staking_form.addEventListener('submit', (e) =>{

    e.preventDefault();
    
    // Get error divs
    let amountErr = document.getElementById('amountErr');

    // Rest the errors
    amountErr.innerHTML = '';

    const amount = edit_staking_form.amount.value;
    const trans_id = edit_staking_form.trans_id.value;

    if (amount.length < 1) {
        amountErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    
 
    fetch('/account/edit-mining', { 
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify({amount, trans_id}) 
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
                window.location.href = '/account/deposit';
            }, 1000);
        }
       
        // Check server errors
        if (data.error) {
            $(document).ready(() =>{
                $('.toast-body').html(data.error);
                $('.toast').css('background-color', 'red'); 
                $('.toast').toast('show');
            });
            setInterval(() => {
                window.location.href = '/account/staking-deposit';
            }, 1000);
        }
    })
    .catch(e => {
        console.log(e)
    })


})