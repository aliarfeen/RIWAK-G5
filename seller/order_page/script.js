window.addEventListener("DOMContentLoaded", function () {

    function runOrdersPage() {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const container = document.getElementById("order_lists");

        // seller الحالي
        const currentSeller = JSON.parse(localStorage.getItem("current_seller"));
        const sellerId = currentSeller ? currentSeller.id : null;

        if (!container) {
            console.error("order_lists container not found!");
            return;
        }

        if (!sellerId) {
            container.innerHTML = `<p style="text-align:center; color:gray;">No seller logged in.</p>`;
            return;
        }

        // فلترة الأوردرات الخاصة بالـ seller
        const sellerOrders = orders
            .map(order => {
                const filteredItems = order.order_details.items.filter(item => item.sellerId === sellerId);
                if (filteredItems.length === 0) return null;

                return {
                    ...order.order_details,
                    items: filteredItems,
                    totalAmount: filteredItems.reduce((sum, i) => sum + (i.total || 0), 0)
                };
            })
            .filter(o => o !== null);

        if (sellerOrders.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:gray;">No orders found for this seller.</p>`;
            return;
        }

        container.innerHTML = "";
        container.innerHTML = "";
sellerOrders.forEach(order => {
    const date = new Date(order.date).toLocaleDateString();

    order.items.forEach(item => {
        const status = item.status ? item.status.toLowerCase() : "pending";

        const itemHTML = `
            <div class="order_list">
                <div class="order_id">
                    <h4>#${order.id}-${item.productId}</h4>
                    <p class="status ${status}">${status.toUpperCase()}</p>
                </div>

                <div class="order_data">
                    <p>Product: ${item.name || "Unknown Product"}</p>
                    <p><i class="fa-regular fa-calendar"></i> ${date}</p>
                    <p>Qty: ${item.quantity || 1}</p>
                    <p>Price: $${item.price || 0}</p>
                    <p>Total: $${item.total || 0}</p>
                    <p>Payment: <span>${order.paymentStatus || "N/A"}</span></p>
                </div>

                <div class="order_icons">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
            </div>
        `;

        container.innerHTML += itemHTML;
    });
});


        // عناصر المودال
        let update = document.getElementById("update_status");
        let cancelBtn = document.getElementById("cancel_btn");
        let saveBtn = document.getElementById("save_btn");
        let statusSpan = update ? update.querySelector(".status_id span") : null;
        let statusSelect = document.getElementById("status_select");

        let currentOrderEl = null;

        // لو المودال موجود
        if (update && cancelBtn && saveBtn && statusSpan && statusSelect) {
            document.querySelectorAll(".order_icons i").forEach(icon => {
                icon.addEventListener("click", (e) => {
                    currentOrderEl = e.target.closest(".order_list");

                    let orderId = currentOrderEl.querySelector(".order_id h4").textContent;
                    let currentStatus = currentOrderEl.querySelector(".order_id p.status").textContent.trim();

                    update.style.display = "flex";  
                    statusSpan.textContent = orderId;
                    statusSelect.value = currentStatus.toLowerCase();
                });
            });

            // Save Changes
            saveBtn.addEventListener("click", () => {
                if (currentOrderEl) {
                    let newStatus = statusSelect.value;

                    let statusEl = currentOrderEl.querySelector(".order_id p.status");
                    statusEl.className = "status " + newStatus;
                    statusEl.textContent = newStatus.toUpperCase();

                    // update localStorage
                    const orderId = currentOrderEl.querySelector(".order_id h4").textContent.replace("#","");
                    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

                    allOrders.forEach(o => {
                        if (o.order_details.id === orderId) {
                            o.order_details.items.forEach(item => {
                                if (item.sellerId === sellerId) {
                                    item.status = newStatus;
                                }
                            });
                        }
                    });

                    localStorage.setItem("orders", JSON.stringify(allOrders));

                    update.style.display = "none"; 
                }
            });

            // Cancel Btn
            cancelBtn.addEventListener("click", () => {
                update.style.display = "none";
            });
        }
    }

    runOrdersPage();
});
