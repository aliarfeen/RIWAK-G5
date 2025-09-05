
document.addEventListener("DOMContentLoaded", () => {
  // ===== Get address elements =====
  const addAddressBtn = document.getElementById("add-address");
  const addAddressForm = document.getElementById("add-address-form");
  const addressFormTitle = document.getElementById("address-form-title");
  const addressEditIndexInput = document.getElementById("address-edit-index");
  const saveAddressBtn = document.getElementById("saveAddressBtn");
  const cancelAddAddressBtn = document.getElementById("cancelAddAddressBtn");
  const addressListContainer = document.getElementById("address-list"); // ✅

  if (!addAddressBtn || !addAddressForm || !saveAddressBtn) {
    console.warn("Address DOM elements missing — address handlers won't be mounted.");
    return;
  }

  // ===== Get card elements =====
  const addNewCardBtn = document.getElementById("add-card");
  const addCardForm = document.getElementById("add-card-form");
  const cancelAddCardBtn = document.getElementById("cancelAddCardBtn");
  const addCardBtn = addCardForm?.querySelector('button[type="submit"]');
  const cardListContainer = document.getElementById("card-list"); // ✅

  if (!addNewCardBtn || !addCardForm || !addCardBtn) {
    console.warn("Card DOM elements missing — card handlers won't be mounted.");
    return;
  }

  // ===== Load current user (safe) =====
  let userProfileData = (() => {
    try {
      const raw = localStorage.getItem("current_user");
      return raw
        ? JSON.parse(raw)
        : { userId: `u_${Date.now()}`, name: "", email: "", addresses: [], cards: [], favourites: [], password: "" };
    } catch (err) {
      console.error("Error parsing current_user from localStorage:", err);
      return { userId: `u_${Date.now()}`, name: "", email: "", addresses: [], cards: [], favourites: [], password: "" };
    }
  })();

  function updateCurrentUser(userData) {
    localStorage.setItem("current_user", JSON.stringify(userData));
    let allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = allUsers.findIndex((u) => u.userId === userData.userId);
    if (userIndex > -1) {
      allUsers[userIndex] = userData;
      localStorage.setItem("users", JSON.stringify(allUsers));
    }
  }

  /* ========== ADDRESS HANDLERS ========== */
  function setupAddressHandlers() {
    function validateAddressForm() {
      const streetEl = document.getElementById("streetAddress");
      const cityEl = document.getElementById("city");
      const countryEl = document.getElementById("country");

      if (typeof validateInput === "function") {
        const s = validateInput(streetEl);
        const c = validateInput(cityEl);
        const co = validateInput(countryEl);
        saveAddressBtn.disabled = !(s && c && co);
        return;
      }

      const isStreetValid = streetEl && streetEl.value.trim() !== "";
      const isCityValid = cityEl && cityEl.value.trim() !== "";
      const isCountryValid = countryEl && countryEl.value.trim() !== "";
      saveAddressBtn.disabled = !(isStreetValid && isCityValid && isCountryValid);
    }

    addAddressBtn.addEventListener("click", () => {
      addAddressForm.style.display = "block";
      addressFormTitle.textContent = "Add New Address";
      addAddressForm.reset();
      addressEditIndexInput.value = "";
      saveAddressBtn.disabled = true;
    });

    cancelAddAddressBtn.addEventListener("click", () => (addAddressForm.style.display = "none"));

    addAddressForm.addEventListener("input", validateAddressForm);

    addAddressForm.addEventListener("submit", function (e) {
      e.preventDefault();
      validateAddressForm();
      if (saveAddressBtn.disabled) return;

      const street = this.querySelector("#streetAddress").value.trim();
      const city = this.querySelector("#city").value.trim();
      const country = this.querySelector("#country").value.trim();

      const addressData = {
        id: addressEditIndexInput.value
          ? userProfileData.addresses[parseInt(addressEditIndexInput.value, 10)].id
          : `a${Date.now()}`,
        street,
        city,
        country,
      };

      if (addressEditIndexInput.value !== "") {
        userProfileData.addresses[parseInt(addressEditIndexInput.value, 10)] = addressData;
      } else {
        userProfileData.addresses.push(addressData);
      }

      updateCurrentUser(userProfileData);
      addAddressForm.style.display = "none";
      reRenderData();
    });

    // Delegated edit/delete buttons
    addressListContainer?.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = parseInt(btn.getAttribute("data-index"), 10);

      if (btn.classList.contains("delete-address-btn")) {
        if (confirm("Delete this address?")) {
          userProfileData.addresses.splice(idx, 1);
          updateCurrentUser(userProfileData);
        }
      }
      if (btn.classList.contains("edit-address-btn")) {
        const addr = userProfileData.addresses[idx];
        addAddressForm.style.display = "block";
        addressFormTitle.textContent = "Edit Address";
        document.getElementById("streetAddress").value = addr.street;
        document.getElementById("city").value = addr.city;
        document.getElementById("country").value = addr.country;
        addressEditIndexInput.value = idx;
        saveAddressBtn.disabled = false;
      }
    });
  }

  /* ========== CARD HANDLERS ========== */
  function setupCardHandlers() {
    function validateCardForm() {
      const cardNumEl = document.getElementById("cardNumber");
      const expiryEl = document.getElementById("cardExpiry");
      const cvvEl = document.getElementById("cardCvv");
      const nameEl = document.getElementById("cardName");

      if (typeof validateInput === "function") {
        const cn = validateInput(cardNumEl, /^\d{16}$/, "Card number must be 16 digits.");
        const ex = validateInput(expiryEl, /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Format MM/YY.");
        const cv = validateInput(cvvEl, /^\d{3,4}$/, "CVV must be 3-4 digits.");
        const nm = validateInput(nameEl);
        addCardBtn.disabled = !(cn && ex && cv && nm);
        return;
      }

      const isCardNumberValid = cardNumEl && /^\d{16}$/.test(cardNumEl.value.trim());
      const isExpiryValid = expiryEl && /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryEl.value.trim());
      const isCvvValid = cvvEl && /^\d{3,4}$/.test(cvvEl.value.trim());
      const isNameValid = nameEl && nameEl.value.trim() !== "";
      addCardBtn.disabled = !(isCardNumberValid && isExpiryValid && isCvvValid && isNameValid);
    }

    addNewCardBtn.addEventListener("click", () => {
      addCardForm.style.display = "block";
      addCardForm.reset();
      addCardBtn.disabled = true;
    });

    cancelAddCardBtn.addEventListener("click", () => (addCardForm.style.display = "none"));

    addCardForm.addEventListener("input", validateCardForm);

    addCardForm.addEventListener("submit", function (e) {
      e.preventDefault();
      validateCardForm();
      if (addCardBtn.disabled) return;

      const newCard = {
        id: `c${Date.now()}`,
        cardNumber: this.querySelector("#cardNumber").value.trim(),
        expiry: this.querySelector("#cardExpiry").value.trim(),
        cvv: this.querySelector("#cardCvv").value.trim(),
        cardHolder: this.querySelector("#cardName").value.trim(),
      };

      userProfileData.cards.push(newCard);
      updateCurrentUser(userProfileData);
      addCardForm.style.display = "none";
      reRenderData()
    });

    cardListContainer?.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = parseInt(btn.getAttribute("data-index"), 10);

      if (btn.classList.contains("delete-card-btn")) {
        if (confirm("Are you sure?")) {
          userProfileData.cards.splice(idx, 1);
          updateCurrentUser(userProfileData);
        }
      }
    });
  }
  function reRenderData() {
  const addressesGroup = document.getElementById("addresses-group");
  const cardsGroup = document.getElementById("cards-group");
  const currentUser = JSON.parse(localStorage.getItem("current_user"));

  /* loading addresses */
  const addresses = currentUser.addresses;
  addressesGroup.innerHTML = ""; // ✅ reset first
  addresses.forEach((e) => {
    let newAddress = document.createElement("div");
    newAddress.innerHTML = `
      <input type="radio" class="btn-check" name="address" id="vbtn-radio${e.id}" value="${e.id}" autocomplete="off">
      <label class="btn btn-outline-dark w-100 mb-5 rounded-3" for="vbtn-radio${e.id}">
        ${e.city}<br>${e.street}
      </label>
    `;
    addressesGroup.appendChild(newAddress);
  });

  /* loading cards */
  const cards = currentUser.cards;
  cardsGroup.innerHTML = ""; // already fine
  cards.forEach((e) => {
    let newCard = document.createElement("div");
    newCard.innerHTML = `
      <input type="radio" class="btn-check" name="card" id="vbtn-radio${e.id}" value="${e.id}" autocomplete="off">
      <label class="btn btn-outline-dark w-100 mb-5 rounded-3" for="vbtn-radio${e.id}">
        xxxx-xxxx-xxxx-${e.cardNumber.slice(-4)}<br>${e.cardHolder}<br>${e.expiry}
      </label>
    `;
    cardsGroup.appendChild(newCard);
  });
}


  // ✅ Run handlers
  setupAddressHandlers();
  setupCardHandlers();

});
