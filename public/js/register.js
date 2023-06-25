
    // validations
    const reg_form = document.getElementById('reg_form');
    reg_form.addEventListener('submit', (e) =>{
        e.preventDefault();
    
        const fullname =  reg_form.fullname.value;
        const email =  reg_form.email.value;
        const password =  reg_form.password.value;
        
    
        const fullnameErr = document.querySelector('.fullnameErr');
        const emailErr = document.querySelector('.emailErr');
        const passwordErr = document.querySelector('.passwordErr');
        const response = document.querySelector('.response');

       
        fullnameErr.innerHTML = '';
        emailErr.innerHTML = '';
        passwordErr.innerHTML = '';
       
    
        const fullnameReg = /^[a-zA-Z\s]+$/;
        const emailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    
        if (!fullnameReg.test(fullname)) {
            fullnameErr.innerHTML = 'Enter a valid fullname';
            throw Error('Terminating')
        }
        
        if (!emailReg.test(email)) {
            emailErr.innerHTML = 'Enter a valid email address';
            throw Error('Terminating')
        }
        
       
    
        if (!passwordReg.test(password)) {
            passwordErr.innerHTML = 'Password must contain a capital, lowercase, digit & symbol';
            throw Error('Terminating')
        }
    
       
    
        const data = {fullname, email, password};
        
        fetch('/auth/register', {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                response.innerHTML = data.success;
                response.style.backgroundColor = '#d1e7dd';
                response.style.padding = '10px'
                response.style.marginBottom = '4px';
                response.style.textAlign = 'center'
    
                setInterval(() => {
                   window.location.href = '/login'
                }, 2000);
            }
            if (data.error) {
                response.innerHTML = data.error;
                response.style.backgroundColor = 'red';
                response.style.padding = '10px'
                response.style.marginBottom = '4px';
                response.style.textAlign = 'center'
            }
    
        })
    
    })