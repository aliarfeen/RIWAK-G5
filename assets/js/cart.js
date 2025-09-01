let cart = [];
let xhr = new XMLHttpRequest();
let percentage = 0;
let rest = 0;

const checkOutBtn = document.getElementById("submiting");

const progressBar = document.getElementById("progress-bar");
const progressBarLable = document.getElementById("progress-bar-lable");

// ---------------------- Init ----------------------
document.addEventListener("DOMContentLoaded", function () {
  setCart();
  setTimeout(() => {
    calculateSubtotalAndProgress();
  }, 3);
});

// ---------------------- Core Functions ----------------------
function setCart() {
  const storedCart = localStorage.getItem("cart");
  cart = storedCart ? JSON.parse(storedCart) : [];

      renderCartItems();
}

window.addEventListener("DOMContentLoaded", function () {
  const thead = this.document.getElementsByTagName("thead")[0];
  const msgDiv = this.document.getElementById("ordered-products");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // default to []
  if (cart.length === 0) {
    thead.classList.add("d-none");
    msgDiv.innerHTML = "<h3 class='text-center '> ADD ITEMS TO CART, NOTHING IS HERE! </h3>"

  }
});


function renderCartItems() {
  let tableBody = document.getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  cart.map((e) => {
    let quantity = 1;
    var createdtr = document.createElement("tr");
    e.orderedquantity= quantity;
    createdtr.innerHTML = `
      <td>
        <img src=${e.images["0"]} alt="" style="height: 40px; width: 40px;">
        <p style="color: black;">${e.name}</p>
        <button id="remove-button-${
          e.id
        }" class="text-decoration-underline">remove</button>
      </td>
      <td>${e.price.toFixed(2)} EGP</td>
      <td>
        <div id="button-group" class="btn-group me-2" role="group" aria-label="Second group">
          <button id="decreamentbutton${
            e.id
          }" type="button" class="btn">&minus;</button>
          <button id="quantityvalue${
            e.id
          }" type="button" class="btn" disabled style="border: none; color: black;">${quantity}</button>
          <button id="increamentbutton${
            e.id
          }" type="button" class="btn">&plus;</button>
        </div>
      </td>
      <td id="pricecell${e.id}">${e.price.toFixed(2)} EGP</td>
      <td>`;

    tableBody.appendChild(createdtr);

    setupCartItemControls(e, quantity);
  });
}

function setupCartItemControls(e, quantity) {
  const subTotal = document.getElementById("subtotal");
  const checkOutBtn = document.getElementById("submiting");
  const pricecell = document.getElementById(`pricecell${e.id}`);
  const quantityElement = document.getElementById(`quantityvalue${e.id}`);
  const decreaseBtn = document.getElementById(`decreamentbutton${e.id}`);
  const increaseBtn = document.getElementById(`increamentbutton${e.id}`);
  const removeButton = document.getElementById(`remove-button-${e.id}`);

  removeButton.style.background = "none";
  removeButton.style.border = "none";

  progressBar.style.width = "0%";

  function updateQuantity() {
    quantityElement.textContent = quantity;
    pricecell.textContent = `${(e.price * quantity).toFixed(2)} EGP`;
    calculateSubtotalAndProgress();
    const indexId = quantityElement.id.split("quantityvalue")[1];
    let item = cart.find((product)=>product.id == indexId);

    item.orderedquantity =+ quantity || 1;
    localStorage.setItem("cart",JSON.stringify(cart))

  }

  decreaseBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;
      updateQuantity();
    }
    
  });

  increaseBtn.addEventListener("click", function () {
    quantity++;
    updateQuantity();
  });

  removeButton.addEventListener("click", function () {
    const index = cart.findIndex((el) => el.id == e.id);
    cart.splice(index, 1);
    localStorage.setItem("cart",JSON.stringify(cart))

    renderCartItems();
    calculateSubtotalAndProgress();

  });
}

checkOutBtn.addEventListener("click", function () {
  const txtArea= document.getElementsByTagName("textarea")[0]
  localStorage.setItem("order_note", txtArea.value)
});
function calculateSubtotalAndProgress() {
  let subtotalSum = 0;
  const subTotal = document.getElementById("subtotal");

  cart.forEach((e) => {
    let totalproduct = document.getElementById(`pricecell${e.id}`);
    let totalproductValue = Number(
      totalproduct.textContent.replace(" EGP", "")
    );
    subtotalSum += totalproductValue;
  });

  localStorage.setItem("subtotal",subtotalSum)

  percentage = (subtotalSum / 10000) * 100;
  rest = (10000 - subtotalSum).toFixed(2);

  if (rest > 0) {
    progressBarLable.innerHTML = `Spend <b>${rest}LE</b> more to get <b>Free Shipping!</b>`;
  }
  if (rest <= 0) {
    progressBarLable.innerHTML = `Congrats You Got <b>Free Shipping!</b>`;
  }

  progressBar.style.width = `${percentage}%`;
  subTotal.textContent = `Subtotal: ${subtotalSum.toFixed(2)} EGP`;
}


