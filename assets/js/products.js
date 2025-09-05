
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



  /// الفلتر الجديد والصحيح
  // price filter
range.addEventListener("input", function () {
  label.innerHTML = `Price: ${minProductPrice} EGP - ${this.value} EGP`;
  applyAllFilters();
});

// color filter
function changecolor(e) {
  var oldselectedcolor = document.querySelector(".colors.active");
  if (oldselectedcolor) oldselectedcolor.classList.remove("active");

  newclickdone = e.target;
  newclickdone.classList.add("active");
  localStorage.setItem("selectedcolor", newclickdone.dataset.color);

  applyAllFilters();
}

// category filter
document.querySelectorAll(".form-check-input").forEach((cat) => {
  cat.addEventListener("change", applyAllFilters);
});
})
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
  products
  .filter(product => product.current_status !== "binding"  && product.current_status !== "rejected")
  .forEach(product => {
    let productDiv = document.createElement("div");
    productDiv.className =
      "col-6 col-md-3 d-flex justify-content-center zoom-container my-3";

    let card = document.createElement("div");
    card.className =
      "card d-flex flex-column align-items-start border-0 w-100 position-relative";

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
      "card-body d-flex flex-column align-items-start text-start";

    // let ratDiv = document.createElement("div");
    // ratDiv.className = "d-flex justify-content-around align-items-center w-100 gap-3";
    let title = document.createElement("h5");
    title.className = "card-title mb-2";
    title.textContent = product.name;

    let rating = document.createElement("p");
    rating.className = "mb-0 d-flex align-items-center gap-1";
    rating.innerHTML = `<i class="bi bi-star-fill text-warning"></i> ${product.rating}`;

    // ratDiv.appendChild(title);
    // ratDiv.appendChild(rating);

    let price = document.createElement("p");
    price.className = "card-text fw-bold";
    price.textContent = product.price + " EGP";

    let favBtn = document.createElement("button");
    favBtn.className =
      "btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm fav position-absolute top-0 end-0 m-2";
    favBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    favBtn.style.width = "45px";
    favBtn.style.height = "45px";
    favBtn.style.backgroundColor = "white";
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
      "btn rounded d-flex align-items-center justify-content-center shadow-sm cart align-self-center mb-3";
    cartBtn.innerHTML = `Add to cart`;
    cartBtn.style.width = "92%";
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

    cardBody.appendChild(title);
    cardBody.appendChild(rating);
    cardBody.appendChild(price);

    card.appendChild(favBtn);
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(cartBtn);

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
      updateCurrentUser(currentUser); 
    }
  }
}



function applyAllFilters() {
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];

  // --- price filter ---
  const range = document.getElementById("priceRange");
  const maxPrice = Number(range.value);

  // --- color filter ---
  const selectedColor = localStorage.getItem("selectedcolor");

  // --- category filters ---
  let selectedCategories = [];
  document.querySelectorAll(".form-check-input:checked").forEach((cb) => {
    selectedCategories.push(cb.value);
  });

  // --- apply filters in sequence ---
  let filtered = allProducts.filter((p) => {
    let passPrice = Number(p.price) <= maxPrice;
    let passColor = !selectedColor || p.colors.includes(selectedColor);
    let passCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    return passPrice && passColor && passCategory;
  });

  // render
  targetdiv.innerHTML = "";
  displayProducts(filtered);
}
