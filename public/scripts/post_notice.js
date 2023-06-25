
const notice_form = document.getElementById('notice_form');


notice_form.addEventListener('submit', (e) =>{
    e.preventDefault();
   
    const title = notice_form.title.value;
    const comment = notice_form.comment.value;

    const data = {title, comment};
    
    fetch('/account/publish-notice', {
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
                window.location.href = '/account/view-notice';
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