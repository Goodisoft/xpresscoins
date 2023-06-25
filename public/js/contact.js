const contact_form = document.getElementById('contact_form');

// const reg_form = document.getElementById('reg_form');

contact_form.addEventListener('submit', (e) =>{

    e.preventDefault();

    const name = contact_form.name.value;
    const email = contact_form.email.value;
    const contact_id = contact_form.contact_id.value;
    const message = contact_form.message.value;

    const nameErr = document.querySelector('.nameErr');
    const emailErr = document.querySelector('.emailErr');
    const messageErr = document.querySelector('.messageErr');
    const response = document.querySelector('.response');


    nameErr.innerHTML = '';
    emailErr.innerHTML = '';
    messageErr.innerHTML = '';
    

    const NameReg  = /^[a-zA-Z\s]+$/;
    const EmailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
    const MessageReg = /^[a-zA-Z\s]+$/;


    if (!NameReg.test(name)) {
        nameErr.innerHTML = 'Enter a valid fullname';
        throw Error ('Terminating')
    }

    if (!EmailReg.test(email)) {
        emailErr.innerHTML = 'Enter a valid email address';
        throw Error ('Terminating')
    }

    if (!MessageReg.test(message)) {
        messageErr.innerHTML = 'Invalid Message Entered';
        throw Error ('Terminating')
    }

    const data = {name, email, message, contact_id};

    fetch('/contact', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((data) => {
       if (data.success) {
            response.innerHTML = data.success;
            response.style.backgroundColor = '#d1e7dd';
            response.style.padding = '10px'
            response.style.marginBottom = '4px';
            response.style.textAlign = 'center'

            setInterval(() => {
               window.location.href = '/'
            }, 4000);
        }
        if (data.error) {
            response.innerHTML = data.error;
            response.style.backgroundColor = 'red';
            response.style.padding = '10px'
            response.style.marginBottom = '6px';
            response.style.textAlign = 'center'
        }

    })

});


