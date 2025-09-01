let sellers = [];
let products = [];
let revenueChart = null;
let incomeChart = null;
let targetdiv = null;


let currentSeller = localStorage.getItem("current_seller");

if (!currentSeller) {
 
  window.location.href = "login.html"; 
}

(async function initLocalStorage() {
    if (!localStorage.getItem("sellers")) {
        const sellersData = await fetch("/assets/json/sellers.json").then(res => res.json());
        localStorage.setItem("sellers", JSON.stringify(sellersData));
    }

    if (!localStorage.getItem("products")) {
        const productsData = await fetch("/assets/json/products.json").then(res => res.json());
        localStorage.setItem("products", JSON.stringify(productsData));
    }
})();


if (window.location.pathname.toLowerCase().includes("login.html")) {
    Promise.all([
        fetch("assets/json/sellers.json").then(res => res.json()),
        fetch("assets/json/products.json").then(res => res.json())
    ])
    .then(([sellersData, productsData]) => {
        sellers = sellersData;
        products = productsData;
        localStorage.setItem("sellers", JSON.stringify(sellers));
        localStorage.setItem("products", JSON.stringify(products));
        console.log("Data loaded successfully.");
    });

    const form = document.getElementById('loginForm');
    if (form) {
        form.querySelectorAll('input').forEach(el => {
            el.addEventListener('input', () => {
                if (el.checkValidity()) {
                    el.classList.remove('is-invalid');
                    el.classList.add('is-valid');
                } else {
                    el.classList.remove('is-valid');
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const storedSellers = JSON.parse(localStorage.getItem("sellers")) || [];
            const seller = storedSellers.find(s => s.email === email && s.password === password);

            if (!seller) {
                alert("Account not exist!");
                return;
            }

            localStorage.setItem("current_seller", JSON.stringify({
                id: seller.id,
                email: seller.email
            }));
            
          
            window.location.href = "dashbord.html"; 
            alert("Login successful!");
        }, false);
    }

    const pwd = document.getElementById('password');
    if(pwd){
        const toggle = document.getElementById('togglePwd');
        toggle.addEventListener('click', () => {
            const isHidden = pwd.type === 'password';
            pwd.type = isHidden ? 'text' : 'password';
            toggle.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
            pwd.focus();
        });
    }
} 

else if (window.location.pathname.toLowerCase().includes("dashbord.html") || window.location.pathname.toLowerCase().includes("products.html")) {
    window.addEventListener('load', function () {
        const currentSeller = JSON.parse(localStorage.getItem("current_seller"));
        if (!currentSeller) {
          
            window.location.href = "Login.html"; 
            return;
        }
        
        targetdiv = document.getElementById('targetdiv');
        if (targetdiv) {
            document.getElementById('mymodal').addEventListener('hidden.bs.modal', function () {
                resetModal();
            });
            displayProducts();
        }
        updateDashboard(currentSeller.id);
    });
}



function updateDashboard(sellerId) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const sellers = JSON.parse(localStorage.getItem("sellers")) || [];
    const sellerProducts = products.filter(p => p.sellerId == sellerId);
    const productStats = sellerProducts.map(p => ({
        name: p.name,
        quantity: p.totalQuantity,
        ordered: p.orderedItems,
        revenue: p.price * p.orderedItems
    }));
    const seller = sellers.find(s => s.id == sellerId);
    
    if (document.getElementById("name")) {
        document.getElementById("name").textContent = seller ? seller.name : "Unknown Seller";
        document.getElementById("totalProducts").textContent = sellerProducts.length;
        document.getElementById("totalRevenue").textContent = productStats.reduce((sum, p) => sum + p.revenue, 0).toLocaleString() + " EGP";
        const top = productStats.reduce((a, b) => (a.ordered > b.ordered ? a : b), { name: "-", ordered: 0 });
        document.getElementById("topProduct").textContent = top.name;
        document.getElementById("outOfStock").textContent = productStats.filter(p => p.quantity === 0).length;
        document.getElementById("lowStock").textContent = productStats.filter(p => p.quantity > 0 && p.quantity < 10).length;

        if (revenueChart) revenueChart.destroy();
        if (incomeChart) incomeChart.destroy();

        const ctx1 = document.getElementById("revenueChart").getContext("2d");
        revenueChart = new Chart(ctx1, {
            type: "pie",
            data: {
                labels: productStats.map(p => p.name),
                datasets: [{
                    data: productStats.map(p => p.revenue),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(255, 206, 86, 0.7)",
                        "rgba(75, 192, 192, 0.7)",
                        "rgba(153, 102, 255, 0.7)"
                    ]
                }]
            }
        });

        const ctx2 = document.getElementById("incomeChart").getContext("2d");
        incomeChart = new Chart(ctx2, {
            type: "bar",
            data: {
                labels: productStats.map(p => p.name),
                datasets: [{
                    label: "Total Income",
                    data: productStats.map(p => p.revenue),
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function displayProducts(filteredProducts) {
    const currentSeller = JSON.parse(localStorage.getItem("current_seller"));
    let products = filteredProducts || JSON.parse(localStorage.getItem("products")) || [];

    if (!currentSeller) {
        targetdiv.innerHTML = "<p class='text-danger'>Please log in first!</p>";
        return;
    }

    let filtered = products.filter(p => p.sellerId == currentSeller.id);
    if (!targetdiv) {
        console.error("Target div not found!");
        return;
    }
    targetdiv.innerHTML = "";

    filtered.forEach(product => {
        let status, statusClass;
        if (product.totalQuantity > 10) {
            status = "ACTIVE";
            statusClass = "btn-success";
        } else if (product.totalQuantity === 0) {
            status = "OUT OF STOCK";
            statusClass = "btn-danger";
        } else {
            status = "LOW STOCK";
            statusClass = "btn-warning";
        }

        let productDiv = document.createElement("div");
        productDiv.classList.add("wrapper");
        
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
        targetdiv.appendChild(productDiv);

        let editBtns = document.getElementsByClassName("edit");
        for (let i = 0; i < editBtns.length; i++) {
            editBtns[i].addEventListener("click", function () {
                let productId = this.getAttribute("data-id");
                loadProductToModal(productId);
            });
        }
        let deleteBtns = document.getElementsByClassName("delete");
        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].addEventListener("click", function () {
                let productId = this.getAttribute("data-id");
                deleteProduct(productId);
            });
        }
    });
}

function productSave() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const currentSeller = JSON.parse(localStorage.getItem("current_seller"));

    if (!currentSeller) {
        alert("You must be logged in as a seller to add products!");
        return;
    }

    let name = document.getElementById("name").value;
    let desc = document.getElementById("desc").value;
    let category = document.getElementById("category").value;
    let path = document.getElementById("path").value;
    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);

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
        sellerId: currentSeller.id, 
        review: [],
        isFavorite: false,
        totalQuantity: quantity
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    if (targetdiv) {
        targetdiv.innerHTML = "";
        displayProducts();
    }
}

function loadProductToModal(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products.find(p => p.id == id);
    if (!product) return;
    document.getElementById("name").value = product.name;
    document.getElementById("desc").value = product.desc;
    document.getElementById("category").value = product.category;
    document.getElementById("path").value = product.images[0] || "";
    document.getElementById("price").value = product.price;
    document.getElementById("quantity").value = product.totalQuantity;
    let footer = document.querySelector("#mymodal .modal-footer");
    footer.innerHTML =
        `<input type="button" value="Update" class="btn-success" data-id="${id}" onclick="updateProduct(this)" data-bs-dismiss="modal">
        <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
}

function updateProduct(btn) {
    let id = btn.getAttribute("data-id");
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = products.findIndex(p => p.id == id);
    if (index === -1) return;
    products[index].name = document.getElementById("name").value;
    products[index].desc = document.getElementById("desc").value;
    products[index].category = document.getElementById("category").value;
    products[index].images[0] = document.getElementById("path").value;
    products[index].price = parseFloat(document.getElementById("price").value);
    products[index].totalQuantity = parseInt(document.getElementById("quantity").value);
    products[index].modifyAt = new Date().toISOString();
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

function resetModalFooter() {
    let footer = document.querySelector("#mymodal .modal-footer");
    footer.innerHTML =
        `<input type="button" value="Add" data-bs-dismiss="modal" class="btn-success" onclick="productSave()">
        <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
}

function addUniqueId(jsonData) {
    let index = 0;
    for (let key in jsonData) {
        index = Math.max(index, parseInt(jsonData[key].id));
    }
    return index + 1;
}

function resetModal() {
    document.getElementById("name").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";
    document.getElementById("path").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    resetModalFooter();
}

function filterFunction() {
    var input, filter, div, productsDiv, i, productDiv, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    div = document.getElementById("targetdiv");
    if (!div) return;
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

function filterProductsByCategory() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let selectedCategory = document.getElementById("categorySelect").value;
    let filteredProducts = products.filter(product => {
        if (selectedCategory === "") return true;
        return product.category.toLowerCase() === selectedCategory.toLowerCase();
    });
    displayProducts(filteredProducts);
}

function filterProductsByStatus() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let selectedStatus = document.getElementById("statusSelect").value;
    let filteredProducts = products.filter(product => {
        if (selectedStatus === "") return true;
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
    displayProducts(filteredProducts);
}

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products = products.filter(p => p.id != id);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}


document.getElementById("logoutBtn").addEventListener("click", function () {
 
  localStorage.removeItem("current_seller");
  

  window.location.href = "login.html";
});
