window.addEventListener('load', function () {

    targetdiv = this.document.getElementById('targetdiv');
    // auto reset footer when open modal
    document.getElementById('mymodal').addEventListener('hidden.bs.modal', function () {
        resetModal();
    });

    targetdiv.addEventListener('click', function (e) {
        if (e.target.closest('.edit')) {
            let id = e.target.closest('.edit').getAttribute('data-id');
            loadProductToModal(id);
        }
        if (e.target.closest('.delete')) {
            let id = e.target.closest('.delete').getAttribute('data-id');
            deleteProduct(id);
        }
    });

    displayProducts();
    displayRequests();

}); //end of load


function displayProducts(filteredProducts) {

    let products = filteredProducts || JSON.parse(localStorage.getItem("products")) || [];

    // clear to not override filteredProducts that coming from category filter function
    targetdiv.innerHTML = "";

    products
  .filter(product => product.current_status !== "binding"  && product.current_status !== "rejected").forEach(product => {
        // button for status
        let status, statusClass;

        if (product.totalQuantity > 10) {
            status = "ACTIVE";
            statusClass = "btn-success";
        } else if (product.totalQuantity === 0) {
            status = "OUT OF STOCK";
            statusClass = "btn-danger";
        } else {
            status = "LOW STOCK";
            statusClass = "warning";
        }

        let productDiv = document.createElement("div");

        productDiv.classList.add("wrapper");
        // div for each product
        productDiv.innerHTML =
            `<div class="d-flex flex-column border border-1 mb-3 p-3">
                <button class="btn ${statusClass} text-white align-self-end">${status}</button>
                <h5 class="mb-1">${product.name}</h5>
                <p class="text-secondary mb-1">${product.desc}</p>
                <p class="fw-bold mb-1">${product.price} EGP</p>
                <button class="btn btn-secondary btn-sm text-white align-self-end fw-bold rounded mb-1">${product.category}</button>
                <p class="text-secondary align-self-end mt-1 mb-0">Sold: ${product.orderedItems}</p>
                <p class="text-success mb-1">Stock: ${product.totalQuantity}</p>
                <p class="text-secondary mb-0">SKU: ${product.sku}</p>
                <hr>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-primary rounded-circle edit" data-bs-toggle="modal" data-bs-target="#mymodal" 
                        data-id="${product.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-outline-success rounded-circle">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-info rounded-circle">
                        <i class="fa-solid fa-cubes"></i>
                    </button>
                    <button class="btn btn-outline-danger rounded-circle delete" data-id="${product.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
        // append product div to target
        targetdiv.appendChild(productDiv);
    });
}

// load product data to modal to be auto filled when open 
function loadProductToModal(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products.find(p => p.id == id);
    if (!product) return;

    // fill modal inputs
    document.getElementById("name").value = product.name;
    document.getElementById("desc").value = product.desc;
    document.getElementById("category").value = product.category;
    document.getElementById("path").value = product.images[0] || "";
    document.getElementById("price").value = product.price;
    document.getElementById("quantity").value = product.totalQuantity;

    // change modal footer button for edit to add another function when click 
    let footer = document.querySelector("#mymodal .modal-footer");
    footer.innerHTML =
        `<input type="button" value="Update" class="btn-success" data-id="${id}" onclick="updateProduct(this)" data-bs-dismiss="modal">
        <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
}

// edit product and save to local storage 
function updateProduct(btn) {
    let id = btn.getAttribute("data-id");
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = products.findIndex(p => p.id == id);
    if (index === -1) return;

    // update product values
    products[index].name = document.getElementById("name").value;
    products[index].desc = document.getElementById("desc").value;
    products[index].category = document.getElementById("category").value;
    products[index].images[0] = document.getElementById("path").value;
    products[index].price = parseFloat(document.getElementById("price").value);
    products[index].totalQuantity = parseInt(document.getElementById("quantity").value);
    products[index].modifyAt = new Date().toISOString();

    // save to local storage
    localStorage.setItem("products", JSON.stringify(products));

    // refresh
    displayProducts();
}

// reset footer when click add button after edit
function resetModalFooter() {
    let footer = document.querySelector("#mymodal .modal-footer");
    footer.innerHTML =
        `<input type="button" value="Add" data-bs-dismiss="modal" class="btn-success" onclick="productSave()">
        <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
}



// unique id for new products
function addUniqueId(jsonData) {
    let index = 0;
    for (let key in jsonData) {
        index = Math.max(index, parseInt(jsonData[key].id));
    }
    return index + 1;
}

// add new product
function productSave() {
    // get data from local storage
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // get value of inputs in modal
    let name = document.getElementById("name").value;
    let desc = document.getElementById("desc").value;
    let category = document.getElementById("category").value;
    let path = document.getElementById("path").value;
    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);

    if (!name || !desc || !category || !path || !price || !quantity) {
        alert("Please fill in all fields before saving the product.");
        return;
    }
    // convert numbers
    price = parseFloat(price);
    quantity = parseInt(quantity);

    if (isNaN(price) || isNaN(quantity)) {
        alert("Price and Quantity must be valid numbers.");
        return;
    }

    // declare new product json object
    let newProduct = {
        id: addUniqueId(products),
        name: name,
        desc: desc,
        createdAt: new Date().toISOString(),
        modifyAt: new Date().toISOString(),
        images: [path],
        colors: ["#d8aa40", "#d9cdb4", "#372f23"],
        sku: "SKU-" + Math.floor(Math.random() * 10000),
        category: category,
        price: price,
        orderedItems: 0,
        sellerId: 2,
        review: [],
        isFavorite: false,
        totalQuantity: quantity
    };

    // push and store to local storage
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // refresh
    targetdiv.innerHTML = "";
    displayProducts();
}

function resetModal() {
    // clear inputs
    document.getElementById("name").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";
    document.getElementById("path").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";

    // reset footer
    resetModalFooter();
}

// search with product name
function filterFunction() {
    var input, filter, div, productsDiv, i, productDiv, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    div = document.getElementById("targetdiv");
    productsDiv = div.getElementsByClassName("wrapper");

    for (i = 0; i < productsDiv.length; i++) {
        productDiv = productsDiv[i];
        txtValue = productDiv.querySelector("h5").textContent || productDiv.querySelector("h5").innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            productDiv.style.display = "";
        } else {
            productDiv.style.display = "none";
        }
    }
}

// filter with chosen category
function filterProductsByCategory() {
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // get selected category from dropdown
    let selectedCategory = document.getElementById("categorySelect").value;

    // filter products
    let filteredProducts = products.filter(product => {
        // if no category selected, show all
        if (selectedCategory === "") return true;
        // otherwise filter by category
        return product.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    // display filtered products
    displayProducts(filteredProducts);
}

// filter with chosen status in stock
function filterProductsByStatus() {
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // get selected status from dropdown
    let selectedStatus = document.getElementById("statusSelect").value;

    // filter products
    let filteredProducts = products.filter(product => {
        // if no status selected, show all
        if (selectedStatus === "") return true;
        // otherwise filter by status
        let status;
        if (product.totalQuantity > 10) {
            status = "Active";
        } else if (product.totalQuantity === 0) {
            status = "Out Of Stock";
        } else {
            status = "Low Stock";
        }
        return status === selectedStatus;
    });

    // display filtered products
    displayProducts(filteredProducts);
}

// delete product and save to local storage
function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }
    let products = JSON.parse(localStorage.getItem("products")) || [];
    id = parseInt(id);
    products = products.filter(p => parseInt(p.id) !== id);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// approve or reject from request container
function displayRequests() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let requestsContainer = document.getElementById("requestsContainer");
    requestsContainer.innerHTML = "";

    products.forEach(product => {
        if (product.current_status === "binding") {
            requestsContainer.innerHTML += `
                <div class="border p-3 mb-2">
                    <h6>${product.name}</h6>
                    <p>${product.desc}</p>
                    <p>${product.price}</p>
                    <button class="btn btn-success btn-sm" onclick="approveProduct(${product.id})">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectProduct(${product.id})">Reject</button>
                </div>`;
        }
    });
}
// if admin clicked approve
function approveProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = products.findIndex(p => p.id == id);
    if (index > -1) {
        products[index].current_status = "approved";
        localStorage.setItem("products", JSON.stringify(products));
        displayRequests();
        displayProducts();
        displayBindingAndRejected();
    }
}
// if admin clicked reject
function rejectProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = products.findIndex(p => p.id == id);
    if (index > -1) {
        products[index].current_status = "rejected";
        localStorage.setItem("products", JSON.stringify(products));
        displayRequests();
        displayProducts();
        displayBindingAndRejected();
    }
};
window.addEventListener('load', function () {

    // ... (الكود الحالي في ملف admin.js)

    // أضف هذا الكود
    const signOutBtn = document.getElementById('sign-out-btn'); // تأكد من أن زر الخروج في ملف HTML له هذا الـ ID
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function(e) {
            e.preventDefault(); // لمنع السلوك الافتراضي للرابط أو الزر
            console.log('Logging out...');
            localStorage.removeItem('current_admin'); // حذف بيانات الأدمن من التخزين المحلي
            window.location.href = '/home.html'; // إعادة التوجيه إلى الصفحة الرئيسية
        });
    }

    // ... (بقية الكود الحالي)

}); //end of load