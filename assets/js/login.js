// Selectors::

// selsect div form:
let loginBox = document.querySelector('.form_box.login');        
let registerBox = document.querySelector('.form_box.register');

// Select form :
let loginForm = document.querySelector('.form_box.login form'); 
let registerForm = document.querySelector('.form_box.register form');
let createAccountBtn = document.querySelector('.btn_primary');




// password icon: 
let passwords = document.querySelectorAll('#pass, #pw');

passwords.forEach(password => {
    let toggle = password.parentElement.querySelector('.toggle-password i');

    if(toggle) {

        toggle.addEventListener('click', () => {

            let type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            toggle.classList.toggle('fa-eye');
            toggle.classList.toggle('fa-eye-slash');

        });
    }
});

// switch form:

createAccountBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';

});

// check valid email:

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// error massage 

function setError(input, message) {
    let parent = input.closest(".form_control, .form_check");
    let error = parent.querySelector(".error");

    if (error) {
        error.innerText = message;
    }

    input.classList.add("error-input");
}

// clear error 
function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.innerText = "");
    document.querySelectorAll("input").forEach(inp => inp.classList.remove("error-input"));
}




// login user :

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    let emailInput = document.getElementById('email');
    let  passInput = document.getElementById('pass');

    // check email::
    if(emailInput.value.trim() === "") {
        setError(emailInput, "email is required");
        isValid = false;
    } else if(!validEmail(emailInput.value.trim())) {
        setError(emailInput, "invalid email");
        isValid = false;
    }

    // check password::
    if(passInput.value.trim() === "") {
        setError(passInput, "Password is required");
        isValid = false;
    } else if(passInput.value.trim().length < 6) {
        setError(passInput, "Password must be at least 6 characters");
        isValid = false;
    }



    if(isValid) {
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.email === emailInput.value.trim() && u.password === passInput.value.trim());

        if(user) {

            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "HomePage.html";

        } else {
        setError(passInput, "invalid email or password");
        }
    }


});



// create account

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    let fn = document.getElementById('fn');
    let ln = document.getElementById('ln');
    let em = document.getElementById('em');
    let pw = document.getElementById('pw');
    let policy = document.getElementById('policy');

    //Handel First name
    if(fn.value.trim() === ""){
        setError(fn, "First name is required");
        isValid = false;
    }

    //Handel Last name
    if(ln.value.trim() === ""){
        setError(ln, "Last name is required");
        isValid = false;
    }

    //Handel Email
    if(em.value.trim() === ""){
        setError(em, "Email is required");
        isValid = false;
    } else if(!validEmail(em.value.trim())){
        setError(em, "Invalid email format");
        isValid = false;
    }

    //Handel Password
    if(pw.value.trim() === ""){
        setError(pw, "Password is required");
        isValid = false;
    } else if(pw.value.length < 6){
        setError(pw, "Password must be at least 6 characters");
        isValid = false;
    }

    // Privacy policy
    if(!policy.checked){
        setError(policy, "You must agree to the privacy policy");
        isValid = false;
    }


    if(isValid){

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if(users.some(u => u.email === em.value.trim())) {
        setError(em, "This email is already registered");
        return;
        }

        const newUser = {
        id: Date.now(),
        firstName: fn.value.trim(),
        lastName: ln.value.trim(),
        email: em.value.trim(),
        password: pw.value.trim()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Account created successfully!');
        registerForm.reset();

        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    }
});
