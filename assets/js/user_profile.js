currentUser = localStorage.getItem("current_user");
window.addEventListener("DOMContentLoaded", function () {
  if (JSON.parse(currentUser) == null) {
    window.location.href = "login.html";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Selectors
  const navLinks = document.querySelectorAll(
    ".profile-nav .nav-link[data-target]"
  );
  const contentSections = document.querySelectorAll(".content-section");
  const mainTitle = document.querySelector(".main-title");
  const editButton = document.getElementById("editButton");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const addressListContainer = document.getElementById("address-list");
  const addNewAddressBtn = document.getElementById("addNewAddressBtn");
  const addAddressForm = document.getElementById("add-address-form");
  const addressFormTitle = document.getElementById("address-form-title");
  const cancelAddAddressBtn = document.getElementById("cancelAddAddressBtn");
  const addressEditIndexInput = document.getElementById("address-edit-index");
  const cardListContainer = document.getElementById("card-list");
  const addNewCardBtn = document.getElementById("addNewCardBtn");
  const addCardForm = document.getElementById("add-card-form");
  const cancelAddCardBtn = document.getElementById("cancelAddCardBtn");
  const changePasswordForm = document.querySelector("#change-password form");
  const newPasswordInput = document.getElementById("newPassword");
  const logoutBtn = document.getElementById("logout-btn");

  let userProfileData;

  // Data Handling
  // function updateCurrentUser(userProfileData) {
  //   localStorage.setItem("current_user", JSON.stringify(userProfileData));
  // }
function updateCurrentUser(userData) {
  localStorage.setItem("current_user", JSON.stringify(userData));

  // جلب قائمة المستخدمين الكاملة
  let allUsers = JSON.parse(localStorage.getItem("users")) || [];

  // البحث عن المستخدم الحالي في القائمة الكاملة
  const userIndex = allUsers.findIndex(u => u.userId === userData.userId);

  // إذا تم العثور عليه، قم بتحديث بياناته في القائمة واحفظها
  if (userIndex > -1) {
    allUsers[userIndex] = userData;
    localStorage.setItem("users", JSON.stringify(allUsers));
  }
}
// الكود الذي يجلب بيانات المستخدم
  function loadFromLocalStorage() {
    const data = localStorage.getItem("current_user");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  // Validation Function
  function validateInput(
    input,
    regex = null,
    errorMessage = "Invalid format."
  ) {
    const errorElement = input.parentElement.querySelector(".invalid-feedback");
    if (!input) return false;

    if (input.value.trim() === "") {
      input.classList.add("is-invalid");
      if (errorElement) errorElement.textContent = "This field is required.";
      return false;
    } else if (regex && !regex.test(input.value)) {
      input.classList.add("is-invalid");
      if (errorElement) errorElement.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove("is-invalid");
      if (errorElement) errorElement.textContent = "";
      return true;
    }
  }

  function renderAccountInfo() {
    const nameParts = userProfileData.name.split(" ");
    firstNameInput.value = nameParts[0] || "";
    lastNameInput.value = nameParts.slice(1).join(" ") || "";
    emailInput.value = userProfileData.email;
    mainTitle.textContent = `HELLO ${nameParts[0].toUpperCase()}`;
  }

  function renderAddresses() {
    addressListContainer.innerHTML =
      userProfileData.addresses.length === 0
        ? "<p>No addresses saved.</p>"
        : "";
    userProfileData.addresses.forEach((address, index) => {
      addressListContainer.innerHTML += `<div class="address-item mb-3 p-3 border rounded"><div><p class="mb-0 fw-bold">${address.street}</p><p class="mb-0 text-muted">${address.city}, ${address.zip}</p></div><div><button class="btn btn-sm btn-outline-dark me-2 edit-address-btn" data-index="${index}">Edit</button><button class="btn btn-sm btn-outline-danger delete-address-btn" data-index="${index}">Delete</button></div></div>`;
    });
  }

  function renderCards() {
    cardListContainer.innerHTML =
      userProfileData.cards.length === 0 ? "<p>No cards saved.</p>" : "";
    userProfileData.cards.forEach((card, index) => {
      cardListContainer.innerHTML += `<div class="card-item mb-3 p-3 border rounded"><div><p class="mb-0">**** **** **** ${card.cardNumber.slice(
        -4
      )}</p><p class="mb-0 text-muted">Holder: ${
        card.cardHolder
      }</p></div><div><button class="btn btn-sm btn-outline-danger delete-card-btn" data-index="${index}">Delete</button></div></div>`;
    });
  }

  function renderOrders() {
    const orderListContainer = document.getElementById("order-list");
    // Get all orders from localStorage
    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // Filter orders for the current user
    const userProfileData =JSON.parse(localStorage.getItem("current_user"))
    let orders = allOrders.filter(
  (order) => String(order.order_details.customerId) === String(userProfileData.userId)

);

    orderListContainer.innerHTML =
      orders.length === 0 ? "<p>You have no orders yet.</p>" : "";
    orders.forEach((order) => {
      let itemsTable =
        '<table class="table table-sm mb-2"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>';
      (order.order_details.items || []).forEach((item) => {
        itemsTable += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td><td>${item.total}</td></tr>`;
      });
      itemsTable += "</tbody></table>";
      orderListContainer.innerHTML += `
  <div class="order-item mb-3 p-3 border rounded" data-id="${order.order_details.id}">
      <div class="order-item-header">
          <h6 class="mb-0 fw-bold">Order #${order.order_details.id}</h6>
          <span class="badge bg-info order-status">${order.order_details.status}</span>
      </div>
      <div class="order-item-body text-muted">
          <p class="mb-1">Date: ${order.order_details.date}</p>
          ${itemsTable}
          <p class="mb-0">Total: <span class="fw-bold text-dark">${order.order_details.totalAmount}</span></p>
      </div>
  </div>`;

    });
    
 // Use event delegation so it works for dynamically added items
orderListContainer.addEventListener('click', function (ev) {
  const itemEl = ev.target.closest('.order-item');
  if (!itemEl) return;

  const orderId = itemEl.dataset.id;
  if (!orderId) return;

  // just store the order id
  localStorage.setItem("current_order_id", orderId);

  // redirect
  window.location.href = "order_tracker.html";
});

  }
  
//  يتم استدعاء الكود الذي يجلب بيانات المستخدم
function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items-container');
    if (!wishlistContainer) {
        console.error("خطأ: لم أجد العنصر id='wishlist-items-container'");
        return;
    }

    const wishlist = userProfileData && userProfileData.favourites ? userProfileData.favourites : [];
    wishlistContainer.innerHTML = ''; 

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p class="col-12">The favorites list is currently empty.</p>';
        return;
    }

    wishlist.forEach((product, index) => {
        let productCol = document.createElement("div");
        productCol.className = "col-lg-4 col-md-6 d-flex justify-content-center my-3";

        let card = document.createElement("div");
        card.className = "card h-100 d-flex flex-column align-items-center border-0";
        card.style.width = "18rem";

        let img = document.createElement("img");
        img.src = product.images[0];
        img.alt = product.name;
        
        img.style.width = "100%";
        img.style.height = "350px";
        img.style.objectFit = "contain";
        img.style.padding = "1rem";
        img.style.cursor = "pointer";

        img.addEventListener("mouseenter", () => {
            if (product.images && product.images[1]) {
                img.src = product.images[1];
            }
        });
        img.addEventListener("mouseleave", () => {
            img.src = product.images[0];
        });

        let cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column align-items-center text-center";

        let title = document.createElement("h5");
        title.className = "card-title mb-2";
        title.textContent = product.name;

        let price = document.createElement("p");
        price.className = "card-text fw-bold";
        price.textContent = product.price + " EGP";

        let iconsRow = document.createElement("div");
        iconsRow.className = "d-flex justify-content-center gap-3 my-2";

        let removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm fav wishlist-remove-btn";
        removeBtn.innerHTML = `<i class="fa fa-trash"></i>`;
        removeBtn.style.width = "60px";
        removeBtn.style.height = "60px";
        removeBtn.title ="Remove from Favorites";
        removeBtn.setAttribute('data-index', index);

        let cartBtn = document.createElement("button");
        cartBtn.className = "btn btn-dark rounded-0 d-flex align-items-center justify-content-center shadow-sm cart wishlist-cart-btn";
        cartBtn.innerHTML = `Add cart ` ;
        cartBtn.style.width = "120px";
        cartBtn.style.height = "50px";
        cartBtn.setAttribute('data-product', JSON.stringify(product));

        // تجميع الكارت
        iconsRow.appendChild(removeBtn);
        iconsRow.appendChild(cartBtn);
        cardBody.appendChild(title);
        cardBody.appendChild(price);
        card.appendChild(img);
        card.appendChild(cardBody);
        card.appendChild(iconsRow);
        productCol.appendChild(card);
        wishlistContainer.appendChild(productCol);
    });
}

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      contentSections.forEach((section) =>
        section.classList.toggle(
          "active",
          section.id === this.getAttribute("data-target")
        )
      );
    });
  });

  editButton.addEventListener("click", function () {
    if (this.textContent === "EDIT") {
      firstNameInput.disabled = false;
      lastNameInput.disabled = false;
      this.textContent = "SAVE";
    } else {
      const isFirstNameValid = validateInput(firstNameInput);
      const isLastNameValid = validateInput(lastNameInput);
      if (!isFirstNameValid || !isLastNameValid) return;

      userProfileData.name = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
      updateCurrentUser(userProfileData);
      renderAccountInfo();
      firstNameInput.disabled = true;
      lastNameInput.disabled = true;
      this.textContent = "EDIT";
      alert("Account information saved!");
    }
  });

  // ==== ADDRESS FORM LOGIC WITH REAL-TIME VALIDATION ====
  const saveAddressBtn = document.getElementById("saveAddressBtn");

  function validateAddressForm() {
    const isStreetValid = validateInput(
      document.getElementById("streetAddress")
    );
    const isCityValid = validateInput(document.getElementById("city"));
    const isCountryValid = validateInput(document.getElementById("country"));
    saveAddressBtn.disabled = !(isStreetValid && isCityValid && isCountryValid);
  }

  addNewAddressBtn.addEventListener("click", () => {
    addAddressForm.style.display = "block";
    addressFormTitle.textContent = "Add New Address";
    addAddressForm.reset();
    addressEditIndexInput.value = "";
    saveAddressBtn.disabled = true;
  });

  cancelAddAddressBtn.addEventListener(
    "click",
    () => (addAddressForm.style.display = "none")
  );
  addAddressForm.addEventListener("input", validateAddressForm);
  addAddressForm.addEventListener("submit", function (e) {
    e.preventDefault();
    validateAddressForm();
    if (saveAddressBtn.disabled) return;

    const addressData = {
      id: addressEditIndexInput.value
        ? userProfileData.addresses[addressEditIndexInput.value].id
        : `a${Date.now()}`,
      street: this.querySelector("#streetAddress").value,
      city: this.querySelector("#city").value,
      // zip: this.querySelector('#zip').value,
      country: this.querySelector("#country").value,
    };

    if (addressEditIndexInput.value) {
      userProfileData.addresses[addressEditIndexInput.value] = addressData;
    } else {
      userProfileData.addresses.push(addressData);
    }
    updateCurrentUser(userProfileData);
    renderAddresses();
    this.style.display = "none";
  });

  addressListContainer.addEventListener("click", function (e) {
    const index = e.target.getAttribute("data-index");
    if (e.target.classList.contains("delete-address-btn")) {
      if (confirm("Are you sure?")) {
        userProfileData.addresses.splice(index, 1);
        updateCurrentUser(userProfileData);
        renderAddresses();
      }
    }
    if (e.target.classList.contains("edit-address-btn")) {
      const address = userProfileData.addresses[index];
      addAddressForm.querySelector("#streetAddress").value = address.street;
      addAddressForm.querySelector("#city").value = address.city;
      // addAddressForm.querySelector('#zip').value = address.zip;
      addAddressForm.querySelector("#country").value = address.country;
      addressEditIndexInput.value = index;
      addressFormTitle.textContent = "Edit Address";
      addAddressForm.style.display = "block";
      validateAddressForm(); // Validate existing data on edit
    }
  });

  // ==== CARD FORM LOGIC WITH REAL-TIME VALIDATION ====
  const addCardBtn = addCardForm.querySelector('button[type="submit"]');

  function validateCardForm() {
    const isCardNumberValid = validateInput(
      document.getElementById("cardNumber"),
      /^\d{16}$/,
      "Card number must be 16 digits."
    );
    const isExpiryValid = validateInput(
      document.getElementById("cardExpiry"),
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Format MM/YY."
    );
    const isCvvValid = validateInput(
      document.getElementById("cardCvv"),
      /^\d{3,4}$/,
      "CVV must be 3-4 digits."
    );
    const isNameValid = validateInput(document.getElementById("cardName"));
    addCardBtn.disabled = !(
      isCardNumberValid &&
      isExpiryValid &&
      isCvvValid &&
      isNameValid
    );
  }

  addNewCardBtn.addEventListener("click", () => {
    addCardForm.style.display = "block";
    addCardForm.reset();
    addCardBtn.disabled = true;
  });

  cancelAddCardBtn.addEventListener(
    "click",
    () => (addCardForm.style.display = "none")
  );
  addCardForm.addEventListener("input", validateCardForm);
  addCardForm.addEventListener("submit", function (e) {
    e.preventDefault();
    validateCardForm();
    if (addCardBtn.disabled) return;

    const newCard = {
      id: `c${Date.now()}`,
      cardNumber: this.querySelector("#cardNumber").value,
      expiry: this.querySelector("#cardExpiry").value,
      cvv: this.querySelector("#cardCvv").value,
      cardHolder: this.querySelector("#cardName").value,
    };
    userProfileData.cards.push(newCard);
    updateCurrentUser(userProfileData);
    renderCards();
    this.style.display = "none";
    alert("Card added successfully!");
  });

  cardListContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-card-btn")) {
      if (confirm("Are you sure?")) {
        userProfileData.cards.splice(e.target.getAttribute("data-index"), 1);
        updateCurrentUser(userProfileData);
        renderCards();
      }
    }
  });

  // password
  const strengthFeedback = document.getElementById(
    "password-strength-feedback"
  );
  newPasswordInput.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;

    let feedbackText = "Strength: ";
    if (password.length === 0) {
      strengthFeedback.textContent = "";
      return;
    }

    switch (strength) {
      case 1:
        strengthFeedback.textContent = feedbackText + "Weak";
        strengthFeedback.style.color = "red";
        break;
      case 2:
      case 3:
        strengthFeedback.textContent = feedbackText + "Medium";
        strengthFeedback.style.color = "orange";
        break;
      case 4:
        strengthFeedback.textContent = feedbackText + "Strong";
        strengthFeedback.style.color = "green";
        break;
      default:
        strengthFeedback.textContent = feedbackText + "Very Weak";
        strengthFeedback.style.color = "red";
    }
  });

  changePasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const currentPasswordInput = this.querySelector("#currentPassword");
    const confirmPasswordInput = this.querySelector("#confirmPassword");

    if (
      !currentPasswordInput.value ||
      !newPasswordInput.value ||
      !confirmPasswordInput.value
    ) {
      alert("Please fill in all password fields.");
      return;
    }
    if (currentPasswordInput.value !== userProfileData.password) {
      alert("Incorrect current password.");
      return;
    }
    if (newPasswordInput.value !== confirmPasswordInput.value) {
      alert("The new passwords do not match.");
      return;
    }
    if (newPasswordInput.value.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }

    userProfileData.password = newPasswordInput.value;
    updateCurrentUser(userProfileData);
    alert("Password changed successfully!");
    this.reset();
    strengthFeedback.textContent = "";
  });

  //LOGOUT L
  // logoutBtn.addEventListener("click", function (e) {
  //   e.preventDefault();

  //   if (confirm("Are you sure you want to log out?")) {
  //     localStorage.removeItem("current_user");
  //     window.location.href = "home.html";
  //   }
  // });
  
// log out confirmation massage
  const confirmLogout = document.getElementById("confirmLogout");

  // Show modal when logout button clicked
  logoutBtn.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
    modal.show();
  });

  // Confirm logout
  confirmLogout.addEventListener("click", () => {
    // Clear user session/localStorage
    localStorage.removeItem("current_user");
    
    // Redirect to login page
    window.location.href = "login.html";
  });

function initializePage() {
    const storedData = loadFromLocalStorage();

document.getElementById('wishlist').addEventListener('click', function (e) {
    const removeBtn = e.target.closest('.wishlist-remove-btn');
    
    const cartBtn = e.target.closest('.wishlist-cart-btn');

    if (removeBtn) {
        if (confirm('Are you sure you want to remove this product?')) {
            const index = removeBtn.getAttribute('data-index');
            
            userProfileData.favourites.splice(index, 1);
            
            updateCurrentUser(userProfileData); 
            
            renderWishlist();     
        }
    }

    // If the clicked element was the add-to-cart button
    if (cartBtn) {
        const product = JSON.parse(cartBtn.getAttribute('data-product'));
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let isFound = cart.find((item) => item.id === product.id);
        if (!isFound) {
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(product.name + " has been added to the cart!");
        } else {
            alert(product.name + " is already in the cart.");
        }
    }
});

    // المسار الأول: إذا وجدنا بيانات للمستخدم في الذاكرة
    if (storedData) {
        userProfileData = storedData;

        console.log("User data loaded from localStorage:", userProfileData);

        renderAccountInfo();
        renderAddresses();
        renderCards();
        renderOrders();
        renderWishlist();
    } 
    else {
        fetch("data.json")
            .then((response) => response.json())
            .then((data) => {
                userProfileData = data;
                console.log("User data fetched from data.json:", userProfileData);
                updateCurrentUser(userProfileData);
                renderAccountInfo();
                renderAddresses();
                renderCards();
                renderOrders();
                renderWishlist();
            })
            .catch((error) => console.error("Error loading initial data:", error));
    }
}
  initializePage();
});

