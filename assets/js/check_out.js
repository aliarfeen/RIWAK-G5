const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // default to []

window.addEventListener("DOMContentLoaded", function () {
  if (cart.length === 0) {
    window.location.href = "home.html";
  }
});

const subtotalVal = localStorage.getItem("subtotal");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const applyCodeBtn = document.getElementById("apply-code");
const promoInput = document.getElementById("promo");

const confirmOrderBtn = document.getElementById("submiting");

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  loadCosts();
  if (JSON.parse(subtotalVal) >= 10000) {
    const shippingAmount = document.getElementById("shipping-amount");
    shippingAmount.innerHTML = "<s>75.00</s>";
  }
  const orderJson = localStorage.getItem("cart");
  const order = JSON.parse(orderJson);

  order.map((e) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("mt-3", "d-flex", "justify-content-between");

    newDiv.innerHTML = `
       <img src="${e.images["0"]}" alt="" style="height: 40px; width: 40px;">
       <p class="item-name">${e.name}</p> 
       <p>${e.orderedquantity || 1} Pcs</p> 
       <p class="price-tag"><b>${(e.price * (e.orderedquantity || 1)).toFixed(
         2
       )}</b> EGP</p>
    `;
    let checkOutDetails = document.getElementById("check-out-details");
    checkOutDetails.appendChild(newDiv);
  });
});

/*user logic*/
function loadUserData() {
  const addressesGroup = document.getElementById("addresses-group");
  const cardsGroup = document.getElementById("cards-group");
  const currentUser = JSON.parse(localStorage.getItem("current_user"));

  /*loading addresses */
  const addresses = currentUser.addresses;
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

  /*loading cards */
  const cards = currentUser.cards;
  cards.forEach((e) => {
    let newCard = document.createElement("div");
    newCard.innerHTML = `
      <input type="radio" class="btn-check" name="card" id="vbtn-radio${
        e.id
      }" value="${e.id}" autocomplete="off">
      <label class="btn btn-outline-dark w-100 mb-5 rounded-3" for="vbtn-radio${
        e.id
      }">
        xxxx-xxxx-xxxx-${e.cardNumber.slice(12)}<br>${e.cardHolder}<br>${
      e.expiry
    }
      </label>
    `;
    cardsGroup.appendChild(newCard);
  });
}

/* loading costs on load */
function loadCosts() {
  subtotal.innerText = subtotalVal;
  if (+subtotalVal >= 10000) {
    total.textContent = +subtotalVal;
  } else {
    total.textContent = +subtotalVal + 75;
  }
}

/*promo code logic*/
applyCodeBtn.addEventListener("click", function () {
  const message = document.getElementById("message");
  const discount = document.getElementById("discount");
  const discountDiv = document.getElementById("discount-div");
  const code = promoInput.value.toLowerCase().trim();

  if (code === "dr-nasr") {
    message.innerText = "You Got 100% Discount";
    discountDiv.classList.remove("d-none");
    discountDiv.classList.add("d-flex");
    message.classList.remove("alert-txt");
    message.classList.add("succeded-txt");

    let discountVal = subtotalVal;
    subtotal.innerText = subtotalVal;
    discount.innerText = discountVal;
    if (+subtotalVal >= 10000) {
      total.textContent = 0;
    } else total.textContent = 75;
  } else if (code === "cst-g5") {
    message.innerText = "You Got 10% Discount";
    discountDiv.classList.remove("d-none");
    discountDiv.classList.add("d-flex");
    message.classList.remove("alert-txt");
    message.classList.add("succeded-txt");

    let newSubTotalVal = (subtotalVal * 0.9).toFixed(2);
    subtotal.innerText = newSubTotalVal;

    let discountVal = (subtotalVal * 0.1).toFixed(2);
    discount.innerText = discountVal;
    if (+subtotalVal >= 10000) {
      total.textContent = +newSubTotalVal;
    } else total.textContent = +newSubTotalVal + 75;
  } else {
    message.innerText = "Invalid promo code";
    message.classList.add("alert-txt");
    discountDiv.classList.add("d-none");

    subtotal.innerText = subtotalVal;
    total.textContent = +subtotalVal + 75;
  }
});

/*end of promo code logic*/

confirmOrderBtn.addEventListener("click", function (e) {
  const cardRadio = document.querySelector('input[name="card"]:checked');
  const addressRadio = document.querySelector('input[name="address"]:checked');
  let valid = true;

  if (!cardRadio) {
    e.preventDefault();
    const paymentTextDiv = document.getElementById("payment-alert");
    paymentTextDiv.innerHTML = `
      <h5>Payment Method</h5>
      <p class="alert-txt">Please select payment method</p>`;
    valid = false;
  }

  if (!addressRadio) {
    e.preventDefault();
    const addressTextDiv = document.getElementById("address-alert");
    addressTextDiv.innerHTML = `
      <h5>Delivery</h5>
      <p class="alert-txt">Please select an address</p>`;
    valid = false;
  }

  if (valid) {
    const finalTotalVal = +total.textContent;
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    const addresses = currentUser.addresses;
    const cards = currentUser.cards;

    const selectedAddressId = addressRadio.value;
    const selectedCardId = cardRadio.value;

    const selectedAddress = addresses.find((a) => a.id == selectedAddressId);
    const selectedCard = cards.find((c) => c.id == selectedCardId);

    const now = new Date();
    const orderJson = localStorage.getItem("cart");
    const order = JSON.parse(orderJson);

 
    const orderItems = order.map((e) => {

      return {
        productId: e.id,
        name: e.name,
        quantity: e.orderedquantity || 1,
        price: parseFloat(e.price.toFixed(2)),
        total: e.price * (e.orderedquantity || 1),
        sellerId: e.sellerId,
      };
    });
    // === Update products in localStorage ===
let products = JSON.parse(localStorage.getItem("products")) || [];

order.forEach((cartItem) => {
  products = products.map((p) => {
    if (p.id === cartItem.id) {
      const quantity = cartItem.orderedquantity || 1;

      // Prevent negative stock
      const newTotalQuantity = Math.max(p.totalQuantity - quantity, 0);
      const addedQuantity = p.totalQuantity - newTotalQuantity;

      return {
        ...p,
        orderedItems: p.orderedItems + addedQuantity,
        modifyAt: new Date().toISOString()
      };
    }
    return p;
  });
});

// Save updated products back to localStorage
localStorage.setItem("products", JSON.stringify(products));

    const userJson = localStorage.getItem("current_user");
    const orderNote = localStorage.getItem("order_note");
    // const orderNoteMsg =JSON.parse(orderNote)
    console.log(orderNote)

    const user = JSON.parse(userJson);
    let allorders = JSON.parse(localStorage.getItem("orders")) || [];
    let lastOrder = allorders[allorders.length - 1];
    let lastIdNum = 0;

    if (lastOrder && lastOrder.id) {
      let parts = lastOrder.id.split("_");
      if (parts.length > 1 && !isNaN(parts[1])) {
        lastIdNum = parseInt(parts[1]);
      }
    }

    let orderObj = {
      order_details: {
        id: generateUniqueId(),
        customerId: user.userId,
        date: `${now.toLocaleString()}`,
        items: orderItems,
        status: `confirmed`,
        statusHistory: [
          {
            status: `pending`,
            timestamp: `${now.toLocaleString()}`,
            updatedBy: `system`,
          },
        ],
        shippingInfo: {
          address: `${selectedAddress.city}, ${selectedAddress.street}`,
          trackingNumber: `${generateUUIDTracking()}`,
        },
        totalAmount: finalTotalVal,
        paymentStatus: `paid`,
        order_note: orderNote,
      },

    };
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(orderObj);
    console.log(orders);
    localStorage.setItem("orders", JSON.stringify(orders));
    console.log("orderObj:", orderObj);
    localStorage.setItem("current_order_id", orderObj.order_details.id);
    
    let modal = new bootstrap.Modal(document.getElementById("orderCreated"));
    modal.show();

    setTimeout(() => {
    modal.hide();
     window.location.href = "order_tracker.html";
}, 2000);
  }
});

function generateUUIDTracking() {
  return (
    "RIWAK-" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
function generateUniqueId(prefix = "RIWAK_", length = 3) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
  let admins = JSON.parse(localStorage.getItem("admins")) || [];
  let allAccounts = [...users, ...sellers, ...admins];

  let id;
  let exists = true;

  while (exists) {
    let randomNum = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, "0"); // ensures leading zeros
    id = prefix + randomNum;

    exists = allAccounts.some((acc) => acc.userId === id);
  }

  return id;
}
