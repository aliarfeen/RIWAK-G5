// Order status:
//     PENDING
//     CONFIRMED
//     PROCESSING
//     SHIPPED
//     DELIVERED
//     CANCELLED




// get data from file json (orders.json):


fetch("orders_new.json")
    .then(res => res.json())
    .then(data => {

    let container = document.getElementById("order_lists");

    // Seller Who Made Login
    const currentSellerId = 2; 

    // Filter Using Product Name :
    // Get All Product Name :
    const namesByLower = new Map();

    data.forEach((orderWrapper) => {
        orderWrapper.order_details.items.forEach((item) => {

            if (item.sellerId === currentSellerId) {
                const lower = item.name.toLowerCase();
                if (!namesByLower.has(lower)) namesByLower.set(lower, item.name);
            }
        });
    });

    const allProducts = Array.from(namesByLower.values());

        // Datalist
        const productDatalist = document.getElementById('product_list');
            if (productDatalist) {
                productDatalist.innerHTML = allProducts
                .sort((a, b) => a.localeCompare(b))
                .map((name) => `<option value="${name}"></option>`)
                .join('');
            }




    // Function for bilding Orders HTML::

    function OrdersHTML(order, sellerItems) {

        const date = new Date(order.date).toLocaleDateString();

        let itemsSeller = sellerItems.map(item => `
            ${item.name} (x${item.quantity})
        `).join("");

        return `
            <div class="order_list">
                <div class="order_id">
                    <h4>#${order.id}</h4>
                    <p class="status ${sellerItems[0].status.toLowerCase()}">
                        ${sellerItems[0].status.toUpperCase()}
                    </p>
                </div>

                <div class="order_data">
                    <p>${itemsSeller}</p>
                    <p><i class="fa-regular fa-calendar"></i> ${date}</p>
                    <p>Items : ${sellerItems.length}</p>
                    <p>Total: $${order.totalAmount}</p>
                    <p>Payment: <span>${order.paymentStatus}</span></p>
                </div>

                <div class="order_icons">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
            </div>
        `;
    }


    // Filter Using ( Status DropDown / Order ID) 

    function renderOrders() {
        let searchValue = document.getElementById("order_search")?.value.toLowerCase() || "";
        let statusValue = document.querySelector(".dropdown-wrapper select")?.value || "all";
        let productValue = document.getElementById("product_search")?.value.toLowerCase().trim() || "";


        container.innerHTML = "";

    data.forEach(orderWrapper => {

        let order = orderWrapper.order_details;

        let sellerItems = order.items.filter(item => item.sellerId === currentSellerId);

        if (sellerItems.length > 0) {
            // Matching Data (Status / OrderID / ProductName)

            const matchOrderId = order.id.toString().toLowerCase().includes(searchValue);
            const matchStatus = (statusValue === "all") || sellerItems.some(item => item.status.toLowerCase() === statusValue);
            const matchProduct = (productValue === "") || sellerItems.some(item => item.name.toLowerCase().includes(productValue));


            if (matchOrderId && matchStatus && matchProduct) {

            container.innerHTML += OrdersHTML(order, sellerItems);

            }
        }
        });
    }
    renderOrders()
    
    // Refresh .....
    document.getElementById("refresh_btn")?.addEventListener("click", () => {
        document.getElementById("order_search").value = "";
        document.querySelector(".dropdown-wrapper select").value = "";
        document.querySelector(".dropdown-wrapper select").value = "all";

        renderOrders();
    });

    // Filter Order ID
    document.getElementById("order_search")?.addEventListener("input", () => {
        document.querySelector(".dropdown-wrapper select").value = "all"; // reset status
        document.getElementById("product_search").value = ""; // reset product
        renderOrders();
    });

    // Filter Status
    document.querySelector(".dropdown-wrapper select")?.addEventListener("change", () => {
        document.getElementById("order_search").value = ""; // reset order id
        document.getElementById("product_search").value = ""; // reset product
        renderOrders();
    });

    // Filter Product Name
    document.getElementById("product_search")?.addEventListener("input", () => {
        document.getElementById("order_search").value = ""; // reset order id
        document.querySelector(".dropdown-wrapper select").value = "all"; // reset status
        renderOrders();
    });


    // data.forEach(orderWrapper => {
    //     let order = orderWrapper.order_details;

    //     // Filter Item For The Current Seller
    //     let sellerItems = order.items.filter(item => item.sellerId === currentSellerId);

    //     if (sellerItems.length > 0) {

    //     container.innerHTML += OrdersHTML(order, sellerItems);

    //     }
    // });



    document.getElementById("order_search")?.addEventListener("input", renderOrders);
    document.querySelector(".dropdown-wrapper select")?.addEventListener("change", renderOrders);
    document.getElementById("product_search")?.addEventListener("input", renderOrders);
    document.getElementById("product_search")?.addEventListener("change", renderOrders);


    // Popup Modal : 

    // Select button::
    let update = document.getElementById("update_status");
    let cancelBtn = document.getElementById("cancel_btn");
    let saveBtn = document.getElementById("save_btn");


    let statusSpan = document.querySelector("#update_status .status_id span"); 
    let statusSelect = document.getElementById("status_select");

    let currentOrderEl = null;

    document.querySelectorAll(".order_icons i").forEach(icon => {
        icon.addEventListener("click", (e) => {

            // save order :
            currentOrderEl = e.target.closest(".order_list");

            let orderId = currentOrderEl.querySelector(".order_id h4").textContent;
            let currentStatus = currentOrderEl.querySelector(".order_id p.status").textContent.trim();

            update.style.display = "flex";  
            console.log("Icons");

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

            update.style.display = "none"; 
        }
    });

    // Cancel Btn
    cancelBtn.addEventListener("click", () => {
        update.style.display = "none";
    });
})
    .catch(err => console.error("Error Loading:", err));



