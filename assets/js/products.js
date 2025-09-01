
function updateCurrentUser(userData) {
  localStorage.setItem("current_user", JSON.stringify(userData));
  let allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = allUsers.findIndex(u => u.userId === userData.userId);
  if (userIndex > -1) {
    allUsers[userIndex] = userData;
    localStorage.setItem("users", JSON.stringify(allUsers));
  }
}

window.addEventListener("load", function () {
  // of json product
  targetdiv = document.getElementById("targetdiv");

  // offcanvas
  const filterContainer = document.getElementById("filterContainer");
  const offcanvasBody = document.getElementById("offcanvasFilterBody");

  function showOffcanvas() {
    const isMobile = window.innerWidth < 768;

    if (isMobile && filterContainer.parentElement !== offcanvasBody) {
      offcanvasBody.appendChild(filterContainer);
      filterContainer.classList.remove("d-none");
    } else if (!isMobile && filterContainer.parentElement === offcanvasBody) {
      document.querySelector(".col-md-3").appendChild(filterContainer);
      filterContainer.classList.remove("d-none");
    }
  }
  window.addEventListener("resize", showOffcanvas);

  // colors
  colorsbar = document.getElementById("cardtwo");
  allcolors = ["#d8aa40", "#d9cdb4", "#372f23"];
  for (var i = 0; i < allcolors.length; i++) {
    createddiv = document.createElement("div");
    createddiv.style.backgroundColor = allcolors[i];
    createddiv.dataset.color = allcolors[i];
    createddiv.addEventListener("click", changecolor);
    createddiv.className = "colors";
    if (allcolors[i] == localStorage.getItem("selectedcolor")) {
      createddiv.className += " active ";
    }
    colorsbar.appendChild(createddiv);
  }

  // products
  loadProducts();

  // price
  const range = document.getElementById("priceRange");
  const label = document.getElementById("priceLabel");
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const maxProductPrice = Math.max(
    ...products.map((p) => Number(p.price)).filter((v) => !isNaN(v))
  );
  const minProductPrice = Math.min(
    ...products.map((p) => Number(p.price)).filter((v) => !isNaN(v))
  );

  range.min = minProductPrice;
  range.max = maxProductPrice;
  range.value = maxProductPrice;
  label.innerHTML = `Price: ${minProductPrice} EGP - ${range.value} EGP`;

  range.addEventListener("input", function () {
    label.innerHTML = `Price: ${minProductPrice} EGP - ${this.value} EGP`;
    let filtered = products.filter((p) => p.price <= Number(this.value));
    targetdiv.innerHTML = "";
    displayProducts(filtered);
  });

  // handle category filters
  document.querySelectorAll(".form-check-input").forEach((cat) => {
    cat.addEventListener("change", filterProductsByCategory);
  });
}); // end of load

// color filter
function changecolor(e) {
  var oldselectedcolor = document.getElementsByClassName("active")[0];
  if (oldselectedcolor != null) oldselectedcolor.className = "colors";
  newclickdone = e.target;
  newclickdone.className += " active ";
  localStorage.setItem("selectedcolor", newclickdone.style.backgroundColor);

  let selectedColor = newclickdone.dataset.color;
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let filtered = allProducts.filter((p) => p.colors.includes(selectedColor));

  targetdiv.innerHTML = "";
  displayProducts(filtered);
}

// load products from JSON (first time) then localStorage
function loadProducts() {
  if (!localStorage.getItem("products")) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/json/products.json", true);
    xhr.send("");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var result = JSON.parse(xhr.responseText);
        localStorage.setItem("products", JSON.stringify(result));
        displayProducts(result);
      }
    };
  } else {
    const productJson = localStorage.getItem("products");
    displayProducts(JSON.parse(productJson));
  }
}

function displayProducts(products) {
  targetdiv.innerHTML = "";
  products.forEach((product) => {
    let productDiv = document.createElement("div");
    productDiv.className =
      "col-6 col-md-3 d-flex justify-content-center zoom-container my-3";

    let card = document.createElement("div");
    card.className =
      "card h-100 d-flex flex-column align-items-center border-0";

    let img = document.createElement("img");
    img.src = product.images[0];
    img.alt = product.name;
    img.addEventListener("mouseenter", () => {
      img.src = product.images[1];
    });
    img.addEventListener("mouseleave", () => {
      img.src = product.images[0];
    });
    img.addEventListener("click", function () {
      productDetails(product);
    });

    let cardBody = document.createElement("div");
    cardBody.className =
      "card-body d-flex flex-column align-items-center text-center";

    let title = document.createElement("h5");
    title.className = "card-title mb-2";
    title.textContent = product.name;

    let price = document.createElement("p");
    price.className = "card-text fw-bold";
    price.textContent = product.price + " EGP";

    let iconsRow = document.createElement("div");
    iconsRow.className = "d-flex justify-content-center gap-3 my-2";

    let favBtn = document.createElement("button");
    favBtn.className =
      "btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm fav";
    favBtn.innerHTML = `<i class="fa fa-heart"></i>`;
    favBtn.style.width = "60px";
    favBtn.style.height = "60px";
    favBtn.addEventListener("click", function () {
      addToFav(product);
      const wishlistModal = new bootstrap.Modal(
        document.getElementById("wishlistModal")
      );
      wishlistModal.show();
      setTimeout(() => {
        wishlistModal.hide();
      }, 1000);
    });

    let cartBtn = document.createElement("button");
    cartBtn.className =
      "btn btn-dark rounded-0 d-flex align-items-center justify-content-center shadow-sm cart";
    cartBtn.innerHTML = `Add To Cart`;
    cartBtn.style.width = "120px";
    cartBtn.style.height = "50px";
    cartBtn.addEventListener("click", () => {
      addToCart(product);
      const cartModal = new bootstrap.Modal(
        document.getElementById("cartModal")
      );
      cartModal.show();
      setTimeout(() => {
        cartModal.hide();
      }, 1000);
    });

    iconsRow.appendChild(favBtn);
    iconsRow.appendChild(cartBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(price);

    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(iconsRow);

    productDiv.appendChild(card);
    targetdiv.appendChild(productDiv);
  });
}

// save cart (no duplicates)
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let isFound = cart.find((e) => e.id == product.id);
  if (!isFound) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function productDetails(product) {
  localStorage.setItem("details", JSON.stringify(product));
  window.location.href = "product_details.html";
}

// filter by category
function filterProductsByCategory() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let selectedFilters = [];
  let checkboxes = document.querySelectorAll(".form-check-input:checked");
  for (let i = 0; i < checkboxes.length; i++) {
    selectedFilters.push(checkboxes[i].value);
  }
  let filteredProducts = products.filter(
    (product) =>
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => product.category === filter)
  );
  targetdiv.innerHTML = "";
  displayProducts(filteredProducts);
}

// wishlist
let currentUser = JSON.parse(localStorage.getItem("current_user"));

// function addToFav(product) {
//   if (!currentUser) {
//     const logInRequiredModal = new bootstrap.Modal(
//       document.getElementById("logInRequiredModal")
//     );
//     logInRequiredModal.show();
//   } else {
//     let fav = currentUser.favourites || [];
//     let isFound = fav.find((e) => e.id == product.id);
//     if (!isFound) {
//       fav.push(product);
//       currentUser.favourites = fav;
//       localStorage.setItem("current_user", JSON.stringify(currentUser));
//     }
//   }
// }
// الكود الجديد والصحيح
function addToFav(product) {
  if (!currentUser) {
    const logInRequiredModal = new bootstrap.Modal(
      document.getElementById("logInRequiredModal")
    );
    logInRequiredModal.show();
  } else {
    let fav = currentUser.favourites || [];
    let isFound = fav.find((e) => e.id == product.id);
    if (!isFound) {
      fav.push(product);
      currentUser.favourites = fav;
      updateCurrentUser(currentUser); // <--- هذا هو التعديل الصحيح
    }
  }
}
