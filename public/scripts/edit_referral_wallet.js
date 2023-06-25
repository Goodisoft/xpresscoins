
const edit_ref_balance_form = document.getElementById('edit_ref_balance_form');


edit_ref_balance_form.addEventListener('submit', (e) =>{
    e.preventDefault();
   
    const user_code = edit_ref_balance_form.user_code.value;
    const balance = edit_ref_balance_form.balance.value;
    const comment = edit_ref_balance_form.comment.value;


    const data = {user_code, balance, comment};
    
    fetch('/account/update-referral-wallet', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify(data)
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
                window.location.href = '/account/view-referral';
            }, 2000);
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