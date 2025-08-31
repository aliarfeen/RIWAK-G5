<<<<<<< HEAD
window.addEventListener('load', function () {
    // of json product
    targetdiv = this.document.getElementById('targetdiv');

    // offcanvas
    const filterContainer = document.getElementById('filterContainer');
    const offcanvasBody = document.getElementById('offcanvasFilterBody');

    function showOffcanvas() {
        const isMobile = window.innerWidth < 768;

        if (isMobile && filterContainer.parentElement !== offcanvasBody) {
            offcanvasBody.appendChild(filterContainer);
            filterContainer.classList.remove('d-none');
        }
        else if (!isMobile && filterContainer.parentElement === offcanvasBody) {
            document.querySelector('.col-md-3').appendChild(filterContainer);
            filterContainer.classList.remove('d-none');
        }
    }

    // showOffcanvas();

    window.addEventListener('resize', showOffcanvas);


    // colors
    colorsbar = document.getElementById('cardtwo');
    allcolors = ["#d8aa40", "#d9cdb4", "#372f23"];
    for (var i = 0; i < allcolors.length; i++) {
        createddiv = document.createElement('div');
        createddiv.style.backgroundColor = allcolors[i];
        createddiv.dataset.color = allcolors[i];
        createddiv.addEventListener('click', changecolor);
        createddiv.className = 'colors';
        if (allcolors[i] == localStorage.getItem('selectedcolor')) {
            createddiv.className += ' active ';
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
  ...products.map(p => Number(p.price)).filter(v => !isNaN(v))
);

    const minProductPrice = Math.min(
  ...products.map(p => Number(p.price)).filter(v => !isNaN(v))
);

    console.log(maxProductPrice);
    range.min = minProductPrice;
    range.max = maxProductPrice;
    range.value = maxProductPrice; 
    label.innerHTML = `Price: ${minProductPrice} EGP - ${range.value} EGP`;

    range.addEventListener("input", function () {
        label.innerHTML = `Price: ${minProductPrice} EGP - ${this.value} EGP`;

        // filter products by price
        // let products = JSON.parse(localStorage.getItem("products")) || [];
        let filtered = products.filter(p => p.price <= Number(this.value));

        targetdiv.innerHTML = "";
        displayProducts(filtered);
    });
    // handle category filters
    document.querySelectorAll(".form-check-input").forEach(cat => {
        cat.addEventListener("change", filterProductsByCategory);
    });






});//end of load

// function of colors event trigger
function changecolor(e) {
    var oldselectedcolor = document.getElementsByClassName('active')[0];
    if (oldselectedcolor != null)
        oldselectedcolor.className = 'colors';
    newclickdone = e.target;
    newclickdone.className += ' active ';
    localStorage.setItem('selectedcolor', newclickdone.style.backgroundColor);

    let selectedColor = newclickdone.dataset.color;
    //filter products by color
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];
    let filtered = allProducts.filter(p => p.colors.includes(selectedColor));

    targetdiv.innerHTML = "";
    displayProducts(filtered);
}


// load json
function loadProducts() {
    // ajax call using xmlhttprequest
    //1- create object from xmlhttprequest
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/json/products.json", true);
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            localStorage.setItem("products", JSON.stringify(result));
            displayProducts(result);
        }
    };//end of load JSON Locally
}

function displayProducts(products) {

    products.forEach(product => {
        // create a wrapper div for each product
        let productDiv = document.createElement("div");
        productDiv.className = "col-6 col-md-3 d-flex justify-content-center zoom-container";

        // create inner card div
        let card = document.createElement("div");
        card.className = "card h-100 d-flex flex-column align-items-center border-0";

        // create img element
        let img = document.createElement("img");
        img.src = product.images[0];
        img.alt = product.name;
        // change image when hover
        img.addEventListener("mouseenter", () => {
            img.src = product.images[1];
        });

        img.addEventListener("mouseleave", () => {
            img.src = product.images[0];
        });

        img.addEventListener("click",function(){
            productDetails(product);
        });

        // create card body for product name
        let cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column align-items-center text-center";

        // product title
        let title = document.createElement("h5");
        title.className = "card-title mb-2";
        title.textContent = product.name;

        // product price
        let price = document.createElement("p");
        price.className = "card-text fw-bold";
        price.textContent = product.price + " EGP";

        // add to cart button and favourite icon
        // --- icons row ---
        let iconsRow = document.createElement("div");
        iconsRow.className = "d-flex justify-content-center gap-3 my-2";

        // favourite icon
        let favBtn = document.createElement("button");
        favBtn.className = "btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm fav";
        favBtn.innerHTML = `<i class="fa fa-heart"></i>`;
        favBtn.style.width = "60px";
        favBtn.style.height = "60px";

        // cart icon
        let cartBtn = document.createElement("button");
        cartBtn.className = "btn btn-dark rounded-0 d-flex align-items-center justify-content-center shadow-sm cart";
        // cartBtn.innerHTML = `<i class="fa fa-shopping-cart"></i>`;
        cartBtn.innerHTML = `Add To Cart`;
        cartBtn.style.width = "120px";
        cartBtn.style.height = "50px";

        cartBtn.addEventListener("click", () => {
            addToCart(product);
        });

        iconsRow.appendChild(favBtn);
        iconsRow.appendChild(cartBtn);

        // append title and price to card body
        cardBody.appendChild(title);
        cardBody.appendChild(price);

        // append img , body , fav , cart to card
        card.appendChild(img);
        card.appendChild(cardBody);
        card.appendChild(iconsRow)

        // append card to product div
        productDiv.appendChild(card);

        // append product div to target
        targetdiv.appendChild(productDiv);
    });
}


// save clicked add to cart product to local storage 
function addToCart(product) {
    // get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    // save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.name + " added to cart!");
}

function productDetails(product) {
    // get current product from localStorage
    let details = JSON.parse(localStorage.getItem("details")) || [];
    details= (product);
    // save updated details
    localStorage.setItem("details", JSON.stringify(details));
     window.location.href = "product_details.html";
=======
window.addEventListener("load", function () {
  // of json product
  targetdiv = this.document.getElementById("targetdiv");

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

  // showOffcanvas();

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

  console.log(maxProductPrice);
  range.min = minProductPrice;
  range.max = maxProductPrice;
  range.value = maxProductPrice;
  label.innerHTML = `Price: ${minProductPrice} EGP - ${range.value} EGP`;

  range.addEventListener("input", function () {
    label.innerHTML = `Price: ${minProductPrice} EGP - ${this.value} EGP`;

    // filter products by price
    // let products = JSON.parse(localStorage.getItem("products")) || [];
    let filtered = products.filter((p) => p.price <= Number(this.value));

    targetdiv.innerHTML = "";
    displayProducts(filtered);
  });
  // handle category filters
  document.querySelectorAll(".form-check-input").forEach((cat) => {
    cat.addEventListener("change", filterProductsByCategory);
  });
}); //end of load

// function of colors event trigger
function changecolor(e) {
  var oldselectedcolor = document.getElementsByClassName("active")[0];
  if (oldselectedcolor != null) oldselectedcolor.className = "colors";
  newclickdone = e.target;
  newclickdone.className += " active ";
  localStorage.setItem("selectedcolor", newclickdone.style.backgroundColor);

  let selectedColor = newclickdone.dataset.color;
  //filter products by color
  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let filtered = allProducts.filter((p) => p.colors.includes(selectedColor));

  targetdiv.innerHTML = "";
  displayProducts(filtered);
}

// load from local storage
function loadProducts() {
  const productJson = localStorage.getItem("products");
  displayProducts(JSON.parse(productJson));
}

function displayProducts(products) {
  products.forEach((product) => {
    // create a wrapper div for each product
    let productDiv = document.createElement("div");
    productDiv.className =
      "col-6 col-md-3 d-flex justify-content-center zoom-container my-3";

    // create inner card div
    let card = document.createElement("div");
    card.className =
      "card h-100 d-flex flex-column align-items-center border-0";

    // create img element
    let img = document.createElement("img");
    img.src = product.images[0];
    img.alt = product.name;
    // change image when hover
    img.addEventListener("mouseenter", () => {
      img.src = product.images[1];
    });

    img.addEventListener("mouseleave", () => {
      img.src = product.images[0];
    });

    img.addEventListener("click", function () {
      productDetails(product);
    });

    // create card body for product name
    let cardBody = document.createElement("div");
    cardBody.className =
      "card-body d-flex flex-column align-items-center text-center";

    // product title
    let title = document.createElement("h5");
    title.className = "card-title mb-2";
    title.textContent = product.name;

    // product price
    let price = document.createElement("p");
    price.className = "card-text fw-bold";
    price.textContent = product.price + " EGP";

    // add to cart button and favourite icon
    // --- icons row ---
    let iconsRow = document.createElement("div");
    iconsRow.className = "d-flex justify-content-center gap-3 my-2";

    // favourite icon
    let favBtn = document.createElement("button");
    favBtn.className =
      "btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm fav";
    favBtn.innerHTML = `<i class="fa fa-heart"></i>`;
    favBtn.style.width = "60px";
    favBtn.style.height = "60px";

    favBtn.addEventListener("click",function(){
        addToFav(product);
        const wishlistModal = new bootstrap.Modal(document.getElementById("wishlistModal"));
      wishlistModal.show();

      // Hide after 1 second
      setTimeout(() => {
        wishlistModal.hide();
      }, 1000);
    })

    // cart icon
    let cartBtn = document.createElement("button");
    cartBtn.className =
      "btn btn-dark rounded-0 d-flex align-items-center justify-content-center shadow-sm cart";
    // cartBtn.innerHTML = `<i class="fa fa-shopping-cart"></i>`;
    cartBtn.innerHTML = `Add To Cart`;
    cartBtn.style.width = "120px";
    cartBtn.style.height = "50px";

    cartBtn.addEventListener("click", () => {
      addToCart(product);
      const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
      cartModal.show();

      // Hide after 1 second
      setTimeout(() => {
        cartModal.hide();
      }, 1000);
    });

    iconsRow.appendChild(favBtn);
    iconsRow.appendChild(cartBtn);

    // append title and price to card body
    cardBody.appendChild(title);
    cardBody.appendChild(price);

    // append img , body , fav , cart to card
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(iconsRow);

    // append card to product div
    productDiv.appendChild(card);

    // append product div to target
    targetdiv.appendChild(productDiv);
  });
}

// save clicked add to cart product to local storage
function addToCart(product) {
  // get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let isFound = cart.find((e)=> e.id == product.id)
    if(!isFound){
        
    cart.push(product);
    // save updated cart
    localStorage.setItem("cart", JSON.stringify(cart));}
}

function productDetails(product) {
  // get current product from localStorage
  let details = JSON.parse(localStorage.getItem("details")) || [];
  details = product;
  // save updated details
  localStorage.setItem("details", JSON.stringify(details));
  window.location.href = "product_details.html";
>>>>>>> admin-hyperlinking
}

//filter products by category
function filterProductsByCategory() {
<<<<<<< HEAD
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let selectedFilters = [];
    let checkboxes = document.querySelectorAll(".form-check-input:checked");

    for (let i = 0; i < checkboxes.length; i++) {
        selectedFilters.push(checkboxes[i].value);
    }

    let filteredProducts = products.filter(product =>
        selectedFilters.length === 0 ||
        selectedFilters.some(filter =>
            product.category === filter
        )
    );

    // clear old results before showing new ones
    targetdiv.innerHTML = "";
    displayProducts(filteredProducts);
}

=======
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

  // clear old results before showing new ones
  targetdiv.innerHTML = "";
  displayProducts(filteredProducts);
}


// Enhances
// wishlist
let currentUser = JSON.parse(localStorage.getItem("current_user")); 

function addToFav(product) {
    if(!currentUser){
        const logInRequiredModal = new bootstrap.Modal(document.getElementById('logInRequiredModal'));
        logInRequiredModal.show();
    }else{
        
    let fav = currentUser.favourites || [];
    let isFound = fav.find((e)=> e.id == product.id)
    if(!isFound){
        
    fav.push(product);
    // save updated fav
    localStorage.setItem("current_user", JSON.stringify(currentUser));
 
    }
    }
}
>>>>>>> admin-hyperlinking
