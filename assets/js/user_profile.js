document.addEventListener('DOMContentLoaded', function () {
    // Selectors
    const navLinks = document.querySelectorAll('.profile-nav .nav-link[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    const mainTitle = document.querySelector('.main-title');
    const editButton = document.getElementById('editButton');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const addressListContainer = document.getElementById('address-list');
    const addNewAddressBtn = document.getElementById('addNewAddressBtn');
    const addAddressForm = document.getElementById('add-address-form');
    const addressFormTitle = document.getElementById('address-form-title');
    const cancelAddAddressBtn = document.getElementById('cancelAddAddressBtn');
    const addressEditIndexInput = document.getElementById('address-edit-index');
    const cardListContainer = document.getElementById('card-list');
    const addNewCardBtn = document.getElementById('addNewCardBtn');
    const addCardForm = document.getElementById('add-card-form');
    const cancelAddCardBtn = document.getElementById('cancelAddCardBtn');
    const changePasswordForm = document.querySelector('#change-password form');
    const newPasswordInput = document.getElementById('newPassword');
    const logoutBtn = document.getElementById('logout-btn');

    let userProfileData;

    // Data Handling
    function saveToLocalStorage() {
        localStorage.setItem('userProfileData', JSON.stringify(userProfileData));
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem('userProfileData');
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }

    // Validation Function
    function validateInput(input, regex = null, errorMessage = 'Invalid format.') {
        const errorElement = input.parentElement.querySelector('.invalid-feedback');
        if (!input) return false;

        if (input.value.trim() === '') {
            input.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = 'This field is required.';
            return false;
        } else if (regex && !regex.test(input.value)) {
            input.classList.add('is-invalid');
            if (errorElement) errorElement.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove('is-invalid');
            if (errorElement) errorElement.textContent = '';
            return true;
        }
    }

   
    function renderAccountInfo() {
        const nameParts = userProfileData.name.split(' ');
        firstNameInput.value = nameParts[0] || '';
        lastNameInput.value = nameParts.slice(1).join(' ') || '';
        emailInput.value = userProfileData.email;
        mainTitle.textContent = `HELLO ${nameParts[0].toUpperCase()}`;
    }

    function renderAddresses() {
        addressListContainer.innerHTML = userProfileData.addresses.length === 0 ? '<p>No addresses saved.</p>' : '';
        userProfileData.addresses.forEach((address, index) => {
            addressListContainer.innerHTML += `<div class="address-item mb-3 p-3 border rounded"><div><p class="mb-0 fw-bold">${address.street}</p><p class="mb-0 text-muted">${address.city}, ${address.zip}</p></div><div><button class="btn btn-sm btn-outline-dark me-2 edit-address-btn" data-index="${index}">Edit</button><button class="btn btn-sm btn-outline-danger delete-address-btn" data-index="${index}">Delete</button></div></div>`;
        });
    }

    function renderCards() {
        cardListContainer.innerHTML = userProfileData.cards.length === 0 ? '<p>No cards saved.</p>' : '';
        userProfileData.cards.forEach((card, index) => {
            cardListContainer.innerHTML += `<div class="card-item mb-3 p-3 border rounded"><div><p class="mb-0">**** **** **** ${card.cardNumber.slice(-4)}</p><p class="mb-0 text-muted">Holder: ${card.cardHolder}</p></div><div><button class="btn btn-sm btn-outline-danger delete-card-btn" data-index="${index}">Delete</button></div></div>`;
        });
    }

    function renderOrders() {
        const orderListContainer = document.getElementById('order-list');
        const orders = userProfileData.orders || [];
        orderListContainer.innerHTML = orders.length === 0 ? '<p>You have no orders yet.</p>' : '';
        orders.forEach(order => {
            let itemsTable = '<table class="table table-sm mb-2"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>';
            (order.items || []).forEach(item => {
                itemsTable += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td><td>${item.total}</td></tr>`;
            });
            itemsTable += '</tbody></table>';
            orderListContainer.innerHTML += `
                <div class="order-item mb-3 p-3 border rounded">
                    <div class="order-item-header">
                        <h6 class="mb-0 fw-bold">Order #${order.id}</h6>
                        <span class="badge bg-secondary order-status">${order.status}</span>
                    </div>
                    <div class="order-item-body text-muted">
                        <p class="mb-1">Date: ${order.date}</p>
                        ${itemsTable}
                        <p class="mb-0">Total: <span class="fw-bold text-dark">${order.total}</span></p>
                    </div>
                </div>`;
        });
    }

   
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            contentSections.forEach(section => section.classList.toggle('active', section.id === this.getAttribute('data-target')));
        });
    });

    editButton.addEventListener('click', function () {
        if (this.textContent === 'EDIT') {
            firstNameInput.disabled = false;
            lastNameInput.disabled = false;
            this.textContent = 'SAVE';
        } else {
            const isFirstNameValid = validateInput(firstNameInput);
            const isLastNameValid = validateInput(lastNameInput);
            if (!isFirstNameValid || !isLastNameValid) return;

            userProfileData.name = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
            saveToLocalStorage();
            renderAccountInfo();
            firstNameInput.disabled = true;
            lastNameInput.disabled = true;
            this.textContent = 'EDIT';
            alert('Account information saved!');
        }
    });

    // ==== ADDRESS FORM LOGIC WITH REAL-TIME VALIDATION ====
    const saveAddressBtn = document.getElementById('saveAddressBtn');

    function validateAddressForm() {
        const isStreetValid = validateInput(document.getElementById('streetAddress'));
        const isCityValid = validateInput(document.getElementById('city'));
        const isCountryValid = validateInput(document.getElementById('country'));
        saveAddressBtn.disabled = !(isStreetValid && isCityValid  && isCountryValid);
    }

    addNewAddressBtn.addEventListener('click', () => {
        addAddressForm.style.display = 'block';
        addressFormTitle.textContent = 'Add New Address';
        addAddressForm.reset();
        addressEditIndexInput.value = '';
        saveAddressBtn.disabled = true;
    });
    
    cancelAddAddressBtn.addEventListener('click', () => addAddressForm.style.display = 'none');
    addAddressForm.addEventListener('input', validateAddressForm);
    addAddressForm.addEventListener('submit', function (e) {
        e.preventDefault();
        validateAddressForm();
        if (saveAddressBtn.disabled) return;
        
        const addressData = {
            id: addressEditIndexInput.value ? userProfileData.addresses[addressEditIndexInput.value].id : `a${Date.now()}`,
            street: this.querySelector('#streetAddress').value,
            city: this.querySelector('#city').value,
            // zip: this.querySelector('#zip').value,
            country: this.querySelector('#country').value
        };
        
        if (addressEditIndexInput.value) {
            userProfileData.addresses[addressEditIndexInput.value] = addressData;
        } else {
            userProfileData.addresses.push(addressData);
        }
        saveToLocalStorage();
        renderAddresses();
        this.style.display = 'none';
    });

    addressListContainer.addEventListener('click', function (e) {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('delete-address-btn')) {
            if (confirm('Are you sure?')) {
                userProfileData.addresses.splice(index, 1);
                saveToLocalStorage();
                renderAddresses();
            }
        }
        if (e.target.classList.contains('edit-address-btn')) {
            const address = userProfileData.addresses[index];
            addAddressForm.querySelector('#streetAddress').value = address.street;
            addAddressForm.querySelector('#city').value = address.city;
            // addAddressForm.querySelector('#zip').value = address.zip;
            addAddressForm.querySelector('#country').value = address.country;
            addressEditIndexInput.value = index;
            addressFormTitle.textContent = 'Edit Address';
            addAddressForm.style.display = 'block';
            validateAddressForm(); // Validate existing data on edit
        }
    });

    // ==== CARD FORM LOGIC WITH REAL-TIME VALIDATION ====
    const addCardBtn = addCardForm.querySelector('button[type="submit"]');

    function validateCardForm() {
        const isCardNumberValid = validateInput(document.getElementById('cardNumber'), /^\d{16}$/, 'Card number must be 16 digits.');
        const isExpiryValid = validateInput(document.getElementById('cardExpiry'), /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format MM/YY.');
        const isCvvValid = validateInput(document.getElementById('cardCvv'), /^\d{3,4}$/, 'CVV must be 3-4 digits.');
        const isNameValid = validateInput(document.getElementById('cardName'));
        addCardBtn.disabled = !(isCardNumberValid && isExpiryValid && isCvvValid && isNameValid);
    }

    addNewCardBtn.addEventListener('click', () => {
        addCardForm.style.display = 'block';
        addCardForm.reset();
        addCardBtn.disabled = true;
    });

    cancelAddCardBtn.addEventListener('click', () => addCardForm.style.display = 'none');
    addCardForm.addEventListener('input', validateCardForm);
    addCardForm.addEventListener('submit', function (e) {
        e.preventDefault();
        validateCardForm();
        if (addCardBtn.disabled) return;

        const newCard = {
            id: `c${Date.now()}`,
            cardNumber: this.querySelector('#cardNumber').value,
            expiry: this.querySelector('#cardExpiry').value,
            cvv: this.querySelector('#cardCvv').value,
            cardHolder: this.querySelector('#cardName').value
        };
        userProfileData.cards.push(newCard);
        saveToLocalStorage();
        renderCards();
        this.style.display = 'none';
        alert('Card added successfully!');
    });
    
    cardListContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-card-btn')) {
            if (confirm('Are you sure?')) {
                userProfileData.cards.splice(e.target.getAttribute('data-index'), 1);
                saveToLocalStorage();
                renderCards();
            }
        }
    });

    // password
    const strengthFeedback = document.getElementById('password-strength-feedback');
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        
        let feedbackText = 'Strength: ';
        if(password.length === 0) {
            strengthFeedback.textContent = '';
            return;
        }

        switch (strength) {
            case 1:
                strengthFeedback.textContent = feedbackText + 'Weak';
                strengthFeedback.style.color = 'red';
                break;
            case 2:
            case 3:
                strengthFeedback.textContent = feedbackText + 'Medium';
                strengthFeedback.style.color = 'orange';
                break;
            case 4:
                strengthFeedback.textContent = feedbackText + 'Strong';
                strengthFeedback.style.color = 'green';
                break;
            default:
                strengthFeedback.textContent = feedbackText + 'Very Weak';
                strengthFeedback.style.color = 'red';
        }
    });

    changePasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const currentPasswordInput = this.querySelector('#currentPassword');
        const confirmPasswordInput = this.querySelector('#confirmPassword');

        if (!currentPasswordInput.value || !newPasswordInput.value || !confirmPasswordInput.value) {
            alert('Please fill in all password fields.');
            return;
        }
        if (currentPasswordInput.value !== userProfileData.password) {
            alert('Incorrect current password.');
            return;
        }
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            alert('The new passwords do not match.');
            return;
        }
        if (newPasswordInput.value.length < 8) {
            alert('New password must be at least 8 characters long.');
            return;
        }

        userProfileData.password = newPasswordInput.value;
        saveToLocalStorage();
        alert('Password changed successfully!');
        this.reset();
        strengthFeedback.textContent = '';
    });
    
    //LOGOUT L
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'home.html';
        }
    });

    
    function initializePage() {
        const storedData = loadFromLocalStorage();
        if (storedData) {
            userProfileData = storedData;
            renderAccountInfo();
            renderAddresses();
            renderCards();
            renderOrders();
        } else {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    userProfileData = data;
                    saveToLocalStorage();
                    renderAccountInfo();
                    renderAddresses();
                    renderCards();
                    renderOrders();
                })
                .catch(error => console.error('Error loading initial data:', error));
        }
    }

    initializePage();
});