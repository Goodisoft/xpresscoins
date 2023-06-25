
const edit_plan_form = document.getElementById('edit_plan_form');


edit_plan_form.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    // Get error divs
    let profitErr = document.getElementById('profitErr');
    let durationErr = document.getElementById('durationErr');
    let activationErr = document.getElementById('activationErr');


    // Rest the errors
    profitErr.innerHTML = '';
    durationErr.innerHTML = '';
    activationErr.innerHTML = '';

    const plan_id = edit_plan_form.plan_id.value;
    const profit = edit_plan_form.profit.value;
    const duration = edit_plan_form.duration.value;
    const activation = edit_plan_form.activation.value; 



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
    
    const data = {plan_id, profit, duration, activation};
    // console.log(data)
    
    fetch('/account/update-plan', {
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
                window.location.href = '/account/view-plan';
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