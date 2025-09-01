// ================= Handler for localStorage =================
window.addEventListener("DOMContentLoaded", function () {
    // This handler function loads data into localStorage if it's not already there.
    function handler(key, file) {
        if (!localStorage.getItem(key)) {
            console.log(`${key} was not found!`);
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `../../assets/json/${file}`, true);
            xhr.send("");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    localStorage.setItem(key, xhr.responseText);
                    // Reload the page only after all data has been loaded
                    if (key === "admins") {
                        window.location.reload();
                    }
                }
            };
        }
    }

    handler("products", "products.json");
    handler("sellers", "sellers.json");
    handler("categories", "categories.json");
    handler("orders", "orders.json");
    handler("admins", "admins.json");
    handler("users", "users.json");
});

// ================= Main Script Logic =================
// This function will contain all the code to run after data is loaded
function runMainScript() {
    let currentSeller = localStorage.getItem("current_seller");

    if (!currentSeller) {
        window.location.href = "../dashboard/login.html";
        return;
    }

    let currentSellerData = null;
    try {
        currentSellerData = JSON.parse(currentSeller);
    } catch (e) {
        console.error("Failed to parse current_seller data:", e);
        window.location.href = "../dashboard/login.html";
        return;
    }

    const currentSellerId = currentSellerData?.id;

    // Use localStorage to get sellers data
    let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
    let seller = sellers.find(s => s.id === currentSellerId);
    let nameDiv = document.getElementById("name");
    if (nameDiv) {
        nameDiv.textContent = seller ? seller.name : "Unknown Seller";
    }

    // Use localStorage to get orders data
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let container = document.getElementById("order_lists");

    if (!container) {
        console.error("Container with id 'order_lists' not found!");
        return;
    }

    let sellerOrders = orders.filter(order => String(order.sellerId) === String(currentSellerId));

    if (sellerOrders.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:gray;">No orders found for this seller.</p>`;
    } else {
        container.innerHTML = '';
        sellerOrders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString();
            const orderHTML = `
                <div class="order_list">
                    <div class="order_id">
                        <h4>#${order.id}</h4>
                        <p class="status ${order.status.toLowerCase()}">${order.status.toUpperCase()}</p>
                    </div>
                    <div class="order_data">
                        <p>Customer: ${order.customerId}</p>
                        <p><i class="fa-regular fa-calendar"></i> ${date}</p>
                        <p>Items : ${order.items.length}</p>
                        <p>Total: $${order.totalAmount}</p>
                        <p>Payment: <span>${order.paymentStatus}</span></p>
                    </div>
                    <div class="order_icons">
                        <i class="fa-solid fa-eye"></i>
                        <i class="fa-solid fa-pen-to-square"></i>
                        <i class="fa-solid fa-truck"></i>
                    </div>
                </div>`;
            container.innerHTML += orderHTML;
        });
    }

    // Popup logic and event listeners
    let update = document.getElementById("update_status");
    let cancelBtn = document.getElementById("cancel_btn");
    let saveBtn = document.getElementById("save_btn");
    let statusSpan = document.querySelector("#update_status .status_id span");
    let statusSelect = document.getElementById("status_select");
    let currentOrderEl = null;

    if (update && cancelBtn && saveBtn && statusSpan && statusSelect) {
        document.querySelectorAll(".order_icons i.fa-pen-to-square").forEach(icon => {
            icon.addEventListener("click", (e) => {
                currentOrderEl = e.target.closest(".order_list");
                let orderId = currentOrderEl.querySelector(".order_id h4").textContent;
                let currentStatus = currentOrderEl.querySelector(".order_id p.status").textContent.trim();
                update.style.display = "flex";
                statusSpan.textContent = orderId;
                statusSelect.value = currentStatus.toLowerCase();
            });
        });

        saveBtn.addEventListener("click", () => {
            if (currentOrderEl) {
                let newStatus = statusSelect.value;
                let statusEl = currentOrderEl.querySelector(".order_id p.status");
                statusEl.className = "status " + newStatus;
                statusEl.textContent = newStatus.toUpperCase();

                let orderId = parseInt(currentOrderEl.querySelector(".order_id h4").textContent.replace("#", ""));
                let orderIndex = orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = newStatus;
                    localStorage.setItem("orders", JSON.stringify(orders));
                }

                update.style.display = "none";
            }
        });

        cancelBtn.addEventListener("click", () => {
            update.style.display = "none";
        });
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("current_seller");
        window.location.href = "../dashboard/login.html";
    });
}