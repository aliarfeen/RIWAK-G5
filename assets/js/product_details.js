
//updated from "product" key to "details" key
if (localStorage.getItem("product")) {
    localStorage.setItem("details", localStorage.getItem("product"));
    localStorage.removeItem("product");
}

//populate from local storage
let product = JSON.parse(localStorage.getItem("details"));
function loadProduct() {

    let mainImg = document.getElementById("mainImage");
    mainImg.src = product.images[0];


    let thumbs = document.querySelectorAll(".thumb");
    thumbs.forEach((thumb, index) => {

        thumb.src = product.images[index];

        if (index === 0) {
            thumb.classList.add("active");
        }


        thumb.addEventListener("click", () => {
            mainImg.src = product.images[index];


            thumbs.forEach(t => t.classList.remove("active"));


            thumb.classList.add("active");
        });
    });

    // detail fields
    document.getElementById("category").textContent = product.category;
    document.getElementById("brand").textContent = product.brand;
    document.getElementById("name").textContent = product.name;
    document.getElementById("description").textContent = product.desc;
    document.getElementById("describtion-sidebar").textContent = product.desc;
    document.getElementById("rating3").textContent = product.rating;
    document.getElementById("price").innerHTML = `<sup class="fw-bold fs-5 me-1">Egp</sup>${product.price}`;
    // rating stars
    let stars = document.getElementById("rating");
    let rating = product.rating;
    let starsHtml = '<span id="starsContainer" style="cursor:pointer;">';

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            // full star
            starsHtml += '<i class="bi bi-star-fill "></i> ';
        } else if (i - rating < 1) {
            // half 
            starsHtml += '<i class="bi bi-star-half "></i> ';
        } else {
            // empty 
            starsHtml += '<i class="bi bi-star"></i> ';
        }
    }
    starsHtml += '</span>'
    stars.innerHTML = starsHtml;
    document.getElementById("rating2").innerHTML = starsHtml;

    //listen on stars container, when clicked, modal opens
    let starsContainer = document.getElementById("starsContainer");
    starsContainer.addEventListener("click", () => {
        let modal = new bootstrap.Modal(document.getElementById("ratingModal"));
        modal.show();
    });

    //reviews
    let reviews = product.reviews;
    let breakdownContainer = document.getElementById("ratingBreakdown");
    breakdownContainer.innerHTML = "";
    //from 5 to 1
    for (let i = 5; i >= 1; i--) {
        let count = reviews.breakdown[i] || 0;
        let percentage = reviews.total > 0 ? (count / reviews.total) * 100 : 0;        ///careful in json, all other porducts is review not reviews

        let row = document.createElement("div");
        row.className = "d-flex align-items-center mb-2";
        row.innerHTML = `
      <div class="me-2 bi">${"★".repeat(i)}</div>
     <div class="flex-grow-1">
      <div class="progress" style="height: 8px;">
     <div class="progress-bar" role="progressbar" style="width: ${percentage.toFixed(1)}%"></div>
     </div>
     </div>
     <div class="ms-2 small text-muted">${count}</div>
    `;
        breakdownContainer.appendChild(row);

        //total reviwes
        let breakdown = reviews.breakdown;
        // convert values to an array
        let values = Object.values(breakdown);
        let total = values.reduce((sum, num) => sum + num, 0);
        document.getElementById("star-reviwes").textContent = total;

    }
//article number
    document.getElementById("Product-number").textContent = product.id;            //or sku
    document.getElementById("totalPriceBox").textContent = product.reviews.total;

}

//the carousel

async function loadProducts() {
    let response = localStorage.getItem("products")
    let data =  JSON.parse(response);


    //only products in the same category
    let relatedProducts = data.filter(p => p.category === product.category && p.id !== product.id
    );

    // 11 products max
    relatedProducts = relatedProducts.slice(0, 11);

    let carouselInner = document.getElementById("carousel-inner");
    carouselInner.innerHTML = "";

    // in groups of 4                             
    for (let i = 0; i < relatedProducts.length; i += 4) {
        let chunk = relatedProducts.slice(i, i + 4);

        let itemDiv = document.createElement("div");
        itemDiv.classList.add("carousel-item", "border-0");
        if (i === 0) itemDiv.classList.add("active", "border-0");      //so the first slide show              

        let row = document.createElement("div");
        row.classList.add("row", "g-md-4", "justify-contect-center");

        chunk.forEach(product => {
            let col = document.createElement("div");
            col.classList.add("col-4", "col-md-3");
            let rating = product.rating;
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    starsHtml += '<i class="bi bi-star-fill "></i>';
                } else if (i - rating < 1) {
                    starsHtml += '<i class="bi bi-star-half"></i>';
                } else {
                    starsHtml += '<i class="bi bi-star "></i>';
                }
            };

            col.innerHTML = `
    <div class="card-box p-1">
    <img src="${product.images[0]}" class="card-img-top product-img" alt="${product.name}" style="cursor: pointer;">
    <div class="card-body">
      <h5 class="card-title ">${product.name}</h5>
    <span class="small">${starsHtml} <span class="text-muted small">(${product.reviews?.total??0})</span>
    </span>
    <p class="card-text m-0"> EGP ${product.price}</p>
    <button id="cardbtns" class="border btn cardbtns w-100" data-id="${product.id}"> Add to cart</button>
    </div>
      </div>
        `;
            row.appendChild(col);


            // click on image, opens the details page
            col.querySelector("img").addEventListener("click", () => {
                localStorage.setItem("details", JSON.stringify(product));
                window.location.href = "product_details.html";
            });
        });
        itemDiv.appendChild(row);
        carouselInner.appendChild(itemDiv);
    }
    //carousel buttons
    let cardBtns = document.querySelectorAll(".cardbtns");
    cardBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            btn.classList.toggle("sucess");
            let productId = btn.dataset.id;

          //  let response = await fetch("products_may.json");
           // let products = await response.json();
           let products = JSON.parse(localStorage.getItem("products")) || [];
            let productObj = products.find(p => p.id == productId);


            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let existingIndex = cart.findIndex(item => item.id === productObj.id);

            if (btn.classList.contains("sucess")) {
                if (existingIndex > -1) {
                    cart[existingIndex].orderedquantity = (cart[existingIndex].orderedquantity || 1) + 1;
                } else {
                    cart.push({ ...productObj, orderedquantity: 1 });
                }
                btn.textContent = "Added";
            } else {
                if (existingIndex > -1) cart.splice(existingIndex, 1);
                btn.textContent = "Add to Cart";
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        });
    });

}

loadProducts();
loadProduct();


//the zoom in effect
let mainImg = document.getElementById("mainImage");
let zooonEnabled = false;

mainImg.addEventListener("click", function () {
    zooonEnabled = true;
});


mainImg.addEventListener("mousemove", function (e) {
    //if click didn't happen the function zoom won't start
    if (!zooonEnabled) return;  //mispilling, now it's correct
    // get the size (width, height) and position(left and top) of the image
    let dims = mainImg.getBoundingClientRect();

    // where the mouse is inside the image
    let mouseX = e.pageX - dims.left;  // distance from the left edge of img
    let mouseY = e.pageY - dims.top;   // distance from the top edge of img

    let xPercent = (mouseX / dims.width) * 100;
    let yPercent = (mouseY / dims.height) * 100;

    // zoom in (scale) and move the zoom center to the mouse point
    mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    mainImg.style.transform = "scale(2)";
});


mainImg.addEventListener("mouseleave", function () {
    if (zooonEnabled) {
        mainImg.style.transform = "scale(1)";
        zooonEnabled = false;
    }
});

//in stock/out of stock/ add to favourite/ only'value'left
let cartBtn = document.getElementById("cartBtn");
let quantity = document.getElementById("quantity-left");
let stockStatus = document.getElementById("stock-status");
function updateStock() {
    let left = product.totalQuantity - product.orderedItems;

    if (left > 0 && left <= 3) {
        quantity.textContent = "*Only " + left + " pieces left, order now!";
        stockStatus.textContent = "In stock";

    } else if (left === 0) {
        stockStatus.textContent = "Out of stock";
        quantity.textContent = "";
        cartBtn.textContent = "Available soon...";         /*here is where i had "Add to favourite"*/
        cartBtn.style.pointerEvents = "none";
        plusBtn.disabled = "true"

    } else if (left > 3) {
        stockStatus.textContent = "In stock";
        quantity.textContent = "";
    }
}
//the counter
let counterValue = 1;
let counterVal = document.getElementById("counter");
let minusBtn = document.getElementById("minusBtn");
let plusBtn = document.getElementById("plusBtn");

// update the btn text
function updateCartBtnText() {
    if (counterValue === 1) {
        cartBtn.textContent = "Add to cart"
    } else {
        cartBtn.textContent = `Add ${counterValue} items to Cart`;
    }
}
// minus btn
minusBtn.addEventListener("click", () => {
    if (counterValue > 1) {
        counterValue--;
        counterVal.textContent = counterValue;
        updateCartBtnText();
        //minus won't go under 1
        if (counterValue <= 1) {
            minusBtn.disabled = true;
        }
        plusBtn.disabled = false;
    }
});
// plus btn
plusBtn.addEventListener("click", () => {
    let left = product.totalQuantity - product.orderedItems;
    //enable only if left is over counter value
    if (counterValue < left || left === 0) {
        counterValue++;
        counterVal.textContent = counterValue;
        updateCartBtnText();
    }
    if (counterValue >= left) {
        plusBtn.disabled = true;
    }
    minusBtn.disabled = false;
});
// pushing main cartbtn into "cart"key in local storage and adding quantity
cartBtn.addEventListener("click", () => {
    cartBtn.textContent = "Added";
    cartBtn.classList.add("sucess");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      //  cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + counterValue;
      cart[existingIndex].orderedquantity = counterValue;

    } else {
        cart.push({ ...product, orderedquantity: counterValue });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
});

updateCartBtnText();
updateStock();



