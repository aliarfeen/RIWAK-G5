/* script.js — Consolidated for dashboard / products pages
   - يعتمد كليًا على localStorage
   - يعرض المنتجات المعتمدة للبائع الحالي
   - أي إضافة/تعديل => current_status = "binding"
   - يعرض binding و rejected في تاب منفصل
*/

/* ---------- Helpers ---------- */
function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
}
function getCurrentSeller() {
    const raw = localStorage.getItem("current_seller");
    if (!raw) return null;
    const parsed = safeParse(raw);
    // support both {id:...} or a primitive id stored
    if (parsed && typeof parsed === "object") return parsed;
    return { id: parsed };
}
function ensureLocalStorageKeys() {
    if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify([]));
    if (!localStorage.getItem("sellers")) localStorage.setItem("sellers", JSON.stringify([]));
    if (!localStorage.getItem("admins")) localStorage.setItem("admins", JSON.stringify([]));
    if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));
}

/* ---------- Globals ---------- */
let targetdiv = null;

/* ---------- Page init (products / dashboard) ---------- */
if (window.location.pathname.toLowerCase().includes("dashbord.html") ||
    window.location.pathname.toLowerCase().includes("products.html")) {

    window.addEventListener('load', function () {
        ensureLocalStorageKeys();

        // ⚠️ WARNING: Removed login redirection for testing purposes
        const currentSeller = getCurrentSeller();
        if (!currentSeller) {
            console.warn("No seller logged in. Some features may not work as expected.");
            // You may want to create a mock seller for testing if needed
            // const currentSeller = { id: 1, name: "Test Seller" };
        }

        // set name in sidebar if موجود
        const sellers = safeParse(localStorage.getItem("sellers")) || [];
        const sellerObj = currentSeller ? sellers.find(s => String(s.id) === String(currentSeller.id)) : null;
        const nameEl = document.getElementById("name");
        if (nameEl) nameEl.textContent = sellerObj ? sellerObj.name : "Unknown Seller";

        targetdiv = document.getElementById('targetdiv');
        if (targetdiv) {
            const mm = document.getElementById('mymodal');
            if (mm) mm.addEventListener('hidden.bs.modal', function () { resetModal(); });

            // delegated handlers (edit / delete) — safer than re-binding every render
            targetdiv.addEventListener('click', function (e) {
                const editBtn = e.target.closest('.edit');
                const delBtn = e.target.closest('.delete');
                if (editBtn) {
                    const id = editBtn.getAttribute('data-id');
                    loadProductToModal(id);
                }
                if (delBtn) {
                    const id = delBtn.getAttribute('data-id');
                    deleteProduct(id);
                }
            });
        }

        // عرض المنتجات و إحصائيات
        displayProducts();
        displayBindingAndRejected();
        updateDashboard(currentSeller ? currentSeller.id : null);

        // logout handler
         document.getElementById('logoutBtn').addEventListener('click', function(e) { e.preventDefault(); console.log('Logging out...');  
                localStorage.removeItem('current_seller'); 

            window.location.href = '/home.html'; });
     
   
    
    });
}

/* ---------- updateDashboard (unchanged logic but robust) ---------- */
function updateDashboard(sellerIdParam) {
    try {
        let sellerId = sellerIdParam;
        if (!sellerId) {
            const cs = getCurrentSeller();
            if (!cs) { console.warn("No seller for updateDashboard"); return; }
            sellerId = cs.id;
        }

        const products = safeParse(localStorage.getItem("products")) || [];
        const sellers = safeParse(localStorage.getItem("sellers")) || [];

        // filter out binding products before any calculation
        const approvedProducts = products.filter(p => 
            p && p.sellerId != null && 
            String(p.sellerId) === String(sellerId) &&
            (!p.current_status || p.current_status === "approved")
        );

        const productStats = approvedProducts.map(p => {
            const quantity = p.totalQuantity ?? p.total_quantity ?? p.quantity ?? p.stock ?? 0;
            const ordered = p.orderedItems ?? p.ordered_items ?? p.ordered ?? 0;
            const price = Number(p.price ?? 0) || 0;
            const cost = Number(p.cost ?? 0) || 0;
            return {
                id: p.id ?? p.sku ?? null,
                name: p.name ?? "-",
                quantity, ordered, price, cost,
                revenue: price * ordered
            };
        });

        const sellerObj = sellers.find(s => String(s.id) === String(sellerId));
        // عناصر الـ dashboard قد لا تكون موجودة على صفحة products فقط -> تحقق
        const nameEl = document.getElementById("name");
        if (nameEl) nameEl.textContent = sellerObj ? sellerObj.name : "Unknown Seller";

        const totalProductsEl = document.getElementById("totalProducts");
        if (totalProductsEl) totalProductsEl.textContent = approvedProducts.length;

        const totalRevenueEl = document.getElementById("totalRevenue");
        if (totalRevenueEl) totalRevenueEl.textContent =
            (productStats.reduce((sum, x) => sum + x.revenue, 0)).toLocaleString() + " EGP";

        const topProductEl = document.getElementById("topProduct");
        if (topProductEl) {
            const top = productStats.reduce((a, b) => (a.ordered > b.ordered ? a : b), { name: "-", ordered: 0 });
            topProductEl.textContent = top.name || "-";
        }

        const outOfStockEl = document.getElementById("outOfStock");
        if (outOfStockEl) outOfStockEl.textContent = productStats.filter(p => (p.quantity ?? 0) === 0).length;

        const lowStockEl = document.getElementById("lowStock");
        if (lowStockEl) lowStockEl.textContent = productStats.filter(p => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) < 10).length;

        // Charts (if موجود Chart.js و العناصر)
        if (typeof Chart !== "undefined") {
            const revenueCanvas = document.getElementById("revenueChart");
            const incomeCanvas = document.getElementById("incomeChart");
            if (revenueCanvas) {
                try { window.revenueChart?.destroy?.(); } catch (e) { }
                const ctx1 = revenueCanvas.getContext("2d");
                window.revenueChart = new Chart(ctx1, {
                    type: "pie",
                    data: {
                        labels: productStats.map(p => p.name),
                        datasets: [{ data: productStats.map(p => p.revenue) }]
                    }
                });
            }
            if (incomeCanvas) {
                try { window.incomeChart?.destroy?.(); } catch (e) { }
                const ctx2 = incomeCanvas.getContext("2d");
                window.incomeChart = new Chart(ctx2, {
                    type: "bar",
                    data: {
                        labels: productStats.map(p => p.name),
                        datasets: [{ label: "Revenue", data: productStats.map(p => p.revenue) }]
                    },
                    options: { responsive: true, scales: { y: { beginAtZero: true } } }
                });
            }
        }
        
        // --- Low Stock Items List ---
        const lowStockListEl = document.getElementById('lowStockList');
        const lowStockItems = productStats
            .filter(p => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) <= 10)
            .sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0));

        if (lowStockListEl) {
            if (lowStockItems.length > 0) {
                lowStockListEl.innerHTML = lowStockItems.map(p => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-semibold">${p.name}</div>
                            <div class="text-muted" style="font-size:.95rem">Stock: ${p.quantity}</div>
                        </div>
                        <div class="badge bg-warning text-dark">${p.quantity} left</div>
                    </div>`).join('');
            } else {
                lowStockListEl.innerHTML = `<div class="text-muted p-3">No low stock items</div>`;
            }
        }

        // --- Top Products List ---
        const topProductsListEl = document.getElementById('topProductsList');
        const topProducts = [...productStats].sort((a, b) => (b.ordered ?? 0) - (a.ordered ?? 0)).slice(0, 5);

        if (topProductsListEl) {
            if (topProducts.length > 0) {
                topProductsListEl.innerHTML = topProducts.map(p => `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="item-info">
                            <p class="name mb-1 fw-semibold">${p.name}</p>
                            <p class="details text-muted mb-0">Price: ${p.price.toLocaleString()} EGP</p>
                        </div>
                        <div class="item-metric">${p.ordered} ordered</div>
                    </div>`).join('');
            } else {
                topProductsListEl.innerHTML = `<div class="text-muted p-3">No top products yet</div>`;
            }
        }

    } catch (err) {
        console.error("updateDashboard error:", err);
    }
}

/* ---------- displayProducts: show only approved products for current seller ---------- */
function displayProducts(filteredProducts) {
    const currentSeller = getCurrentSeller();
    if (!currentSeller) {
        if (targetdiv) targetdiv.innerHTML = "<p class='text-danger'>Please log in first!</p>";
        return;
    }

    const allProducts = filteredProducts || safeParse(localStorage.getItem("products")) || [];
    const filtered = allProducts
  .filter(product => product.current_status !== "binding"  && product.current_status !== "rejected").filter(p =>
        String(p.sellerId) === String(currentSeller.id) &&
        (!p.current_status || p.current_status === "approved")
    );

    if (!targetdiv) return;
    targetdiv.innerHTML = "";

    filtered.forEach(product => {
        let status, statusClass;
        if ((product.totalQuantity ?? 0) > 10) { status = "ACTIVE"; statusClass = "btn-success"; }
        else if ((product.totalQuantity ?? 0) === 0) { status = "OUT OF STOCK"; statusClass = "btn-danger"; }
        else { status = "LOW STOCK"; statusClass = "btn-warning"; }

        const div = document.createElement("div");
        div.classList.add("wrapper");
        div.innerHTML = `
            <div class="d-flex flex-column border border-1 mb-3 p-3">
                <button class="btn ${statusClass} text-white align-self-end">${status}</button>
                <h5 class="mb-1">${product.name}</h5>
                <p class="text-secondary mb-1">${product.desc || ""}</p>
                <p class="fw-bold mb-1">${product.price} EGP</p>
                <button class="btn btn-secondary btn-sm text-white align-self-end fw-bold rounded mb-1">${product.category || ""}</button>
                <p class="text-secondary align-self-end mt-1 mb-0">Sold: ${product.orderedItems ?? 0}</p>
                <p class="text-success mb-1">Stock: ${product.totalQuantity ?? 0}</p>
                <p class="text-secondary mb-0">SKU: ${product.sku ?? ""}</p>
                <hr>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-outline-primary rounded-circle edit" data-bs-toggle="modal" data-bs-target="#mymodal" data-id="${product.id}">
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
        targetdiv.appendChild(div);
    });
}

/* ---------- productSave: new product => binding ---------- */
function productSave() {
    const products = safeParse(localStorage.getItem("products")) || [];
    const currentSeller = getCurrentSeller();
    if (!currentSeller) { alert("You must be logged in as a seller to add products!"); return; }

    const name = (document.getElementById("name")?.value || "").trim();
    const desc = (document.getElementById("desc")?.value || "").trim();
    const category = (document.getElementById("category")?.value || "").trim();
    const path = (document.getElementById("path")?.value || "").trim();
    const price = parseFloat(document.getElementById("price")?.value || 0);
    const quantity = parseInt(document.getElementById("quantity")?.value || 0);

    const newProduct = {
        id: addUniqueId(products),
        name, desc, category,
        createdAt: new Date().toISOString(),
        modifyAt: new Date().toISOString(),
        images: [path],
        colors: ["#d8aa40", "#d9cdb4", "#372f23"],
        sku: "SKU-" + Math.floor(Math.random() * 10000),
        price, orderedItems: 0,
        sellerId: currentSeller.id,
        review: [], isFavorite: false, totalQuantity: quantity,
        current_status: "binding" // new products go to binding
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    displayBindingAndRejected();
    resetModal();
}

/* ---------- loadProductToModal & updateProduct ---------- */
function loadProductToModal(id) {
    const products = safeParse(localStorage.getItem("products")) || [];
    const product = products.find(p => String(p.id) === String(id));
    if (!product) return;

    const nameEl = document.getElementById("name-1");if (nameEl)nameEl.value = product.name || "";
    const descEl = document.getElementById("desc"); if (descEl) descEl.value = product.desc || "";
    const catEl = document.getElementById("category"); if (catEl) catEl.value = product.category || "";
    const pathEl = document.getElementById("path"); if (pathEl) pathEl.value = (product.images && product.images[0]) || "";
    const priceEl = document.getElementById("price"); if (priceEl) priceEl.value = product.price ?? "";
    const qtyEl = document.getElementById("quantity"); if (qtyEl) qtyEl.value = product.totalQuantity ?? "";

    const footer = document.querySelector("#mymodal .modal-footer");
    if (footer) {
        footer.innerHTML =
            `<input type="button" value="Update" class="btn-success" data-id="${product.id}" onclick="updateProduct(this)" data-bs-dismiss="modal">
         <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
    }
}

function updateProduct(btn) {
    const id = btn.getAttribute("data-id");
    const products = safeParse(localStorage.getItem("products")) || [];
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return;

    products[idx].name = document.getElementById("name-1")?.value || products[idx].name;
    products[idx].desc = document.getElementById("desc")?.value || products[idx].desc;
    products[idx].category = document.getElementById("category")?.value || products[idx].category;
    products[idx].images = products[idx].images || [];
    products[idx].images[0] = document.getElementById("path")?.value || products[idx].images[0];
    products[idx].price = parseFloat(document.getElementById("price")?.value || products[idx].price);
    products[idx].totalQuantity = parseInt(document.getElementById("quantity")?.value || products[idx].totalQuantity);
    products[idx].modifyAt = new Date().toISOString();

    // any edit goes back to binding for admin review
    products[idx].current_status = "binding";

    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
    displayBindingAndRejected();
    resetModal();
}

/* ---------- resetModal / resetModalFooter ---------- */
function resetModalFooter() {
    const footer = document.querySelector("#mymodal .modal-footer");
    if (!footer) return;
    footer.innerHTML =
        `<input type="button" value="Add" data-bs-dismiss="modal" class="btn-success" onclick="productSave()">
      <input type="button" value="Close" data-bs-dismiss="modal" class="btn-danger">`;
}
function resetModal() {
    const ids = ["name-1", "desc", "category", "path", "price", "quantity"];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    resetModalFooter();
}

/* ---------- addUniqueId (robust) ---------- */
function addUniqueId(list) {
    // returns next integer id (handles string/number ids)
    if (!Array.isArray(list) || list.length === 0) return 1;
    let max = 0;
    list.forEach(it => {
        const id = it?.id ?? it?.sku ?? null;
        const num = parseInt(id);
        if (!isNaN(num)) max = Math.max(max, num);
    });
    return max + 1;
}

/* ---------- deleteProduct ---------- */
function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const products = safeParse(localStorage.getItem("products")) || [];
    const newList = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem("products", JSON.stringify(newList));
    displayProducts();
    displayBindingAndRejected();
}

/* ---------- Filters & Search ---------- */
function filterFunction() {
    const term = (document.getElementById("search")?.value || "").toLowerCase();
    const all = safeParse(localStorage.getItem("products")) || [];
    if (!term) { displayProducts(all); return; }
    const filtered = all.filter(p => {
        return (p.name || "").toLowerCase().includes(term) ||
            (p.desc || "").toLowerCase().includes(term) ||
            (p.category || "").toLowerCase().includes(term);
    });
    displayProducts(filtered);
}
function filterProductsByCategory() {
    const sel = (document.getElementById("categorySelect")?.value || "").trim();
    const all = safeParse(localStorage.getItem("products")) || [];
    if (!sel) { displayProducts(all); return; }
    displayProducts(all.filter(p => (p.category || "").toLowerCase() === sel.toLowerCase()));
}
function filterProductsByStatus() {
    const sel = (document.getElementById("statusSelect")?.value || "").trim();
    const all = safeParse(localStorage.getItem("products")) || [];
    if (!sel) { displayProducts(all); return; }
    const filtered = all.filter(p => {
        const qty = Number(p.totalQuantity ?? p.quantity ?? 0);
        let status = "Active";
        if (qty === 0) status = "Out Of Stock";
        else if (qty <= 10) status = "Low Stock";
        return status === sel;
    });
    displayProducts(filtered);
}

/* ---------- displayBindingAndRejected (for admin/seller view) ---------- */
function displayBindingAndRejected() {
    const products = safeParse(localStorage.getItem("products")) || [];
    const bindingContainer = document.getElementById("bindingContainer");
    const rejectedContainer = document.getElementById("rejectedContainer");

    if (bindingContainer) bindingContainer.innerHTML = "";
    if (rejectedContainer) rejectedContainer.innerHTML = "";

    const currentSeller = getCurrentSeller();

    products.forEach(product => {
        // if container exists and product belongs to current seller (for seller view)
        const belongsToSeller = currentSeller ? String(product.sellerId) === String(currentSeller.id) : true;

        if (product.current_status === "binding" && belongsToSeller) {
            if (bindingContainer) {
                bindingContainer.innerHTML += `
                    <div class="border p-3 mb-2">
                        <h6>${product.name}</h6>
                        <p>${product.desc || ""}</p>
                        <p>${product.price} EGP</p>
                        <span class="badge bg-warning">Binding</span>
                    </div>`;
            }
        } else if (product.current_status === "rejected" && belongsToSeller) {
            if (rejectedContainer) {
                rejectedContainer.innerHTML += `
                    <div class="border p-3 mb-2 bg-light">
                        <h6>${product.name}</h6>
                        <p>${product.desc || ""}</p>
                        <p>${product.price} EGP</p>
                        <span class="badge bg-danger">Rejected</span>
                    </div>`;
            }
        }
    });
}