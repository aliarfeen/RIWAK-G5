const subtotalVal = localStorage.getItem("subtotal");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const applyCodeBtn = document.getElementById("apply-code");
const promoInput = document.getElementById("promo");

const confirmOrderBtn = document.getElementById("submiting");

document.addEventListener("DOMContentLoaded", function () {
  loadCurrentUser();
  loadUserData();
  loadCosts();
  const orderJson = localStorage.getItem("order");
  const order = JSON.parse(orderJson);
  order.map((e) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("mt-3");
    newDiv.classList.add("d-flex");
    newDiv.classList.add("justify-content-between");

    newDiv.innerHTML = `
       <img src="${e.images["0"]}" alt="" style="height: 40px; width: 40px;">
       <p class="item-name" >${e.name}</p> <p> ${
      e.orderedquantity
    } Pcs</p> <p class="price-tag"><b> ${(e.price * e.orderedquantity).toFixed(
      2
    )}</b> EGP</p>
    
    `;
    let checkOutDetails = document.getElementById("check-out-details");
    checkOutDetails.appendChild(newDiv);
  });
});

/*user logic*/
function loadCurrentUser() {
  fetch("./assets/json/users.json")
    .then((response) => response.json())
    .then((Alldata) => {
      localStorage.setItem("current_user", JSON.stringify(Alldata[0]));
    });
}
function loadUserData() {
  const addressesGroup = document.getElementById("addresses-group");

  const cardsGroup = document.getElementById("cards-group");
  const currentUser = JSON.parse(localStorage.getItem("current_user"));
  /*loading Adresses */
  const addresses = currentUser.addresses;

  addresses.forEach((e) => {
    let newAddress = document.createElement("div");
    newAddress.innerHTML = `
      <input type="radio" class="btn-check" name="address" id="vbtn-radio${e.id}" value="${e.id}" autocomplete="off">
      <label class="btn btn-outline-dark w-100 mb-5 rounded-0" for="vbtn-radio${e.id}">
        ${e.city}<br>${e.street}
      </label>
    `;
    addressesGroup.appendChild(newAddress);
  });

  /*loading cards */
  const cards = currentUser.cards;

  cards.forEach((e) => {
    let newAddress = document.createElement("div");
    newAddress.innerHTML = `
      <input type="radio" class="btn-check" name="card" id="vbtn-radio${
        e.id
      }" value="${e.id}" autocomplete="off">
      <label class="btn btn-outline-dark w-100 mb-5 rounded-0" for="vbtn-radio${
        e.id
      }">
        xxxx-xxxx-xxxx-${e.cardNumber.slice(12)}<br>${e.cardHolder}<br>${
      e.expiry
    }
      </label>
    `;
    cardsGroup.appendChild(newAddress);
  });
}

/* loading costs on load */
function loadCosts() {
  subtotal.innerText = subtotalVal;
  total.textContent = +subtotalVal + 75;
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
    let newSubTotalVal = subtotalVal;
    let discountVal = subtotalVal;
    subtotal.innerText = newSubTotalVal;
    discount.innerText = discountVal;

    total.textContent = 75;
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


    total.textContent = +newSubTotalVal + 75;
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
        <p  class="alert-txt">Please select payment method </p>`;
  }

  if (!addressRadio) {
    e.preventDefault();
    const addressTextDiv = document.getElementById("address-alert");
    addressTextDiv.innerHTML = `
    
        <h5>Delivery</h5>
        <p class="alert-txt">Please select an address</p>`;
  }

  if (valid) {
    const finalTotalVal = +(total.textContent);
    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    /*loading Adresses */
    const addresses = currentUser.addresses;

    /*loading cards */
    const cards = currentUser.cards;

    const selectedAddressId = addressRadio.value;

    console.log("Selected address ID:", selectedAddressId);
    const selectedcardId = cardRadio.value;

    // If you need the full address object, you can find it in your addresses array
    const selectedAddress = addresses.find(
      (address) => address.id == selectedAddressId
    );
    console.log("Full address:", selectedAddress);

    const selectedCard = cards.find((card) => card.id == selectedcardId);
    console.log("CARD:", selectedCard);
    
    const now = new Date();
    const orderJson = localStorage.getItem("order");
    const order = JSON.parse(orderJson);
    console.log(order);
    const orderItems = order.map((e) => {
    return {
        "productId": e.id,
        "name": e.name,
        "quantity": e.orderedquantity,
        "price": parseFloat(e.price.toFixed(2)),
        "total": e.price * e.orderedquantity,
        "sellerId": e.sellerId
    };
});
    alert("accepted");
    const userJson = localStorage.getItem("current_user");
    const user = JSON.parse(userJson);
    let orderObj = {
      id: `RIWAK_${generateUUIDTracking().slice(1,6)}`,
      customerId: user.id,
      date: `${now.toLocaleString()}`,
      items: orderItems,
      status: `pending`,
      statusHistory: [
        {
          status: `pending`,
          timestamp: `${now.toLocaleString()}`,
          updatedBy: `system`,
        },
      ],
      shippingInfo: {
        address: `${selectedAddress.city},${selectedAddress.street}`,
        trackingNumber: `${generateUUIDTracking()}`,
      },
      totalAmount: finalTotalVal,
      paymentStatus: `paid`,
    };
// Debug what you're trying to store
console.log('orderObj:', orderObj);
console.log('Stringified:', JSON.stringify(orderObj));

// Then store it
localStorage.setItem("order_details", JSON.stringify(orderObj));  
 this.submit(); 
}


});

function generateUUIDTracking() {
    return 'RIWAK-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
