currentUser = localStorage.getItem("current_user");
window.addEventListener("DOMContentLoaded", function () {
    if (JSON.parse(currentUser) != null) {
        window.location.href = "user_profile.html";
    }
});

// Selectors
let loginBox = document.querySelector(".form_box.login");
let registerBox = document.querySelector(".form_box.register");

let loginForm = document.querySelector(".form_box.login form");
let registerForm = document.querySelector(".form_box.register form");
let createAccountBtn = document.querySelector(".btn_primary");

// password toggle
let passwords = document.querySelectorAll("#pass, #pw");
passwords.forEach((password) => {
    let toggle = password.parentElement.querySelector(".toggle-password i");
    if (toggle) {
        toggle.addEventListener("click", () => {
            let type =
                password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            toggle.classList.toggle("fa-eye");
            toggle.classList.toggle("fa-eye-slash");
        });
    }
});

// switch form
createAccountBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginBox.style.display = "none";
    registerBox.style.display = "block";
});

// helper functions
function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function setError(input, message) {
    let parent = input.closest(".form_control, .form_check");
    let error = parent.querySelector(".error");
    if (error) error.innerText = message;
    input.classList.add("error-input");
}
function clearErrors() {
    document.querySelectorAll(".error").forEach((el) => (el.innerText = ""));
    document
        .querySelectorAll("input")
        .forEach((inp) => inp.classList.remove("error-input"));
}

// login user
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    let emailInput = document.getElementById("email");
    let passInput = document.getElementById("pass");

    if (emailInput.value.trim() === "") {
        setError(emailInput, "Email is required");
        isValid = false;
    } else if (!validEmail(emailInput.value.trim())) {
        setError(emailInput, "Invalid email");
        isValid = false;
    }
    if (passInput.value.trim() === "") {
        setError(passInput, "Password is required");
        isValid = false;
    } else if (passInput.value.trim().length < 5) {
        setError(passInput, "Password must be at least 6 characters");
        isValid = false;
    }

    if (isValid) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
        let admins = JSON.parse(localStorage.getItem("admins")) || [];

        let allAccounts = [...users, ...sellers, ...admins];

        let account = allAccounts.find(
            (u) =>
                u.email === emailInput.value.trim() &&
                u.password === passInput.value.trim()
        );

        if (account) {
            localStorage.setItem("current_user", JSON.stringify(account));

            // التوجيه حسب الدور
            if (account.role === "seller") {
                localStorage.setItem("current_seller", JSON.stringify(account));
                window.location.href = "../../seller/dashboard/dashbord.html";
            } else if (account.role === "admin") {
                localStorage.setItem("current_admin", JSON.stringify(account));
                window.location.href = "../../admin/admain_dashbord/admin_dashboard.html";
            } else {
                window.location.href = "home.html"; // user عادي
            }
        } else {
            setError(passInput, "Invalid email or password");
        }
    }
});

// register user
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    let fn = document.getElementById("fn");
    let ln = document.getElementById("ln");
    let em = document.getElementById("em");
    let pw = document.getElementById("pw");
    let policy = document.getElementById("policy");

    if (fn.value.trim() === "") {
        setError(fn, "First name is required");
        isValid = false;
    }
    if (ln.value.trim() === "") {
        setError(ln, "Last name is required");
        isValid = false;
    }
    if (em.value.trim() === "") {
        setError(em, "Email is required");
        isValid = false;
    } else if (!validEmail(em.value.trim())) {
        setError(em, "Invalid email format");
        isValid = false;
    }
    if (pw.value.trim() === "") {
        setError(pw, "Password is required");
        isValid = false;
    } else if (pw.value.length < 6) {
        setError(pw, "Password must be at least 6 characters");
        isValid = false;
    }
    if (!policy.checked) {
        setError(policy, "You must agree to the privacy policy");
        isValid = false;
    }

    if (isValid) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some((u) => u.email === em.value.trim())) {
            setError(em, "This email is already registered");
            return;
        }

        const newUser = {
            userId: Date.now().toString(),
            name: `${fn.value.trim()} ${ln.value.trim()}`,
            email: em.value.trim(),
            password: pw.value.trim(),
            role: "user", //  لازم نحدد role user
            createdAt: new Date().toLocaleDateString("en-GB"),
            modifyAt: new Date().toLocaleDateString("en-GB"),
            devices: [],
            cards: [],
            favourites: [],
            addresses: [],
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        registerForm.reset();
        registerBox.style.display = "none";
        loginBox.style.display = "block";
    }
});