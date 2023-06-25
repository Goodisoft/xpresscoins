
const edit_promo_form = document.getElementById('edit_promo_form');


edit_promo_form.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    // Get error divs
    let profitErr = document.getElementById('profitErr');
    let durationErr = document.getElementById('durationErr');
    let activationErr = document.getElementById('activationErr');


    // Rest the errors
    profitErr.innerHTML = '';
    durationErr.innerHTML = '';
    activationErr.innerHTML = '';

    const promo_id = edit_promo_form.promo_id.value;
    const profit = edit_promo_form.profit.value;
    const duration = edit_promo_form.duration.value;
    const activation = edit_promo_form.activation.value; 



    if (profit.length < 1) {
        profitErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    if (duration.length < 1) {
        durationErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    if (activation.length < 1) {
        activationErr.innerHTML = 'This field is required';
        throw Error('Terminate process');
    }
    
    const data = {promo_id, profit, duration, activation};
    // console.log(data)
    
    fetch('/account/update-promo-plan', {
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
                window.location.href = '/account/view-promo-plans';
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