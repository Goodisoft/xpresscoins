
const edit_mining_session_form = document.getElementById('edit_mining_session_form');


edit_mining_session_form.addEventListener('submit', (e) =>{
    e.preventDefault();
   
    const investment_amount = edit_mining_session_form.investment_amount.value;
    const withdrawal_day = edit_mining_session_form.withdrawal_day.value;
    const mining_id = edit_mining_session_form.mining_id.value;
    const comment = edit_mining_session_form.comment.value;


    const data = {investment_amount, withdrawal_day, mining_id, comment}; 
    
    fetch('/account/update-mining-session', {
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
                window.location.href = '/account/view-mining-acccount';
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