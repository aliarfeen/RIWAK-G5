// Order status:
//     PENDING
//     CONFIRMED
//     PROCESSING
//     SHIPPED
//     DELIVERED
//     CANCELLED




// get data from file json (orders.json):

// Promise.all([
//     fetch("orders_new.json").then(res => res.json()),
//     fetch("sellers.json").then(res => res.json())
// ])
// .then(([ordersData, sellersData]) => {


    let ordersData = JSON.parse(localStorage.getItem("orders"));
    let sellersData = JSON.parse(localStorage.getItem("sellers"));

    console.log(ordersData);
    
    let container = document.getElementById("order_lists");
    let filterSelect = document.querySelector(".dropdown-wrapper select");


    // Maping For seller ::

    let sellersMap = new Map();
    sellersData.forEach(seller => {
        sellersMap.set(seller.id, seller.name);
    });


    // // .........Convert object to array : 

    function buildOrders(data) {
        return data.map(item => {
            let order = item.order_details;
            return {
                id: order.id,
                date: order.date,
                items: order.items || [],
                totalAmount: order.totalAmount,
                paymentStatus: order.paymentStatus,
                status: order.status || (order.items[0]?.status || "pending")
            };
        });
    }

    let orders = buildOrders(ordersData);


    // Function for Render Ordars ::

    function Orders(orders) {
        container.innerHTML = "";

        orders.map(order => {
            const date = new Date(order.date).toLocaleDateString();
            const productNames = order.items
                .map(item => {
                    let sellerName = sellersMap.get(item.sellerId) || "Unknown Seller";
                    return `${item.name} (${sellerName})`;
                })
                .join(", ");

            const orderHTML = `
                <div class="order_list">
                    <div class="order_id">
                        <h4>#${order.id}</h4>
                        <p class="status ${order.status.toLowerCase()}">${order.status.toUpperCase()}</p>
                    </div>

                    <div class="order_data">
                        <p>${productNames}</p>
                        <p><i class="fa-regular fa-calendar"></i> ${date}</p>
                        <p>Items : ${order.items.length}</p>
                        <p>Total: $${order.totalAmount}</p>
                        <p>Payment: <span>${order.paymentStatus}</span></p>
                    </div>

                    <div class="order_icons">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                </div>
            `;

            container.innerHTML += orderHTML;
        });

        editEvents()

    }

    // Orders(orders);

    
    // Popup Modal : 

    
    // Function for Edit Events :
    // Select button::

    let update = document.getElementById("update_status");
    let cancelBtn = document.getElementById("cancel_btn");
    let saveBtn = document.getElementById("save_btn");
    let statusSpan = document.querySelector("#update_status .status_id span");
    let statusSelect = document.getElementById("status_select");
    let currentOrderEl = null;


    // Edit Events::

    function editEvents() {

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
    }


    // Save Changes
    saveBtn.addEventListener("click", () => {
        if (currentOrderEl) {
            
            let newStatus = statusSelect.value;
            let statusEl = currentOrderEl.querySelector(".order_id p.status");

            statusEl.className = "status " + newStatus;
            statusEl.textContent = newStatus.toUpperCase();

            let orderId = currentOrderEl.querySelector(".order_id h4").textContent.replace("#", "");
            let orderObj = orders.find(o => o.id == orderId);
            if (orderObj) {
                orderObj.status = newStatus;
            }

            // Save In localStorare:
            // localStorage.setItem("orders", JSON.stringify(orders));

            console.log(localStorage.getItem("orders"));


            // orders = buildOrders(orders);
            Orders(orders);


            update.style.display = "none"; 
        }
    });




    // Cancel Btn
    cancelBtn.addEventListener("click", () => {
        update.style.display = "none";
    });

    Orders(orders);

    // Filter Using Status ::

    filterSelect.addEventListener("change", (e) => {
        let selectedStatus = e.target.value;

        if (orderSearch) orderSearch.value = "";
        if (productSearch) productSearch.value = "";

        if (selectedStatus === "all") {
            Orders(orders);
        } else {
            let filteredOrders = orders.filter(order => 
                order.status.toLowerCase() === selectedStatus
            );
            Orders(filteredOrders);
        }
    });



    // Filter Using ProductName ::

    let productSearch = document.getElementById("product_search");
    let productList = document.getElementById("product_list");

    function fillProductList(orders) {

        let allProducts = new Set();

        orders.forEach(order => {
            order.items.forEach(item => {
                allProducts.add(item.name);
            });
        });

        productList.innerHTML = "";

        allProducts.forEach(name => {
            let option = document.createElement("option");
            option.value = name;
            productList.appendChild(option);
        });
    }

    productSearch.addEventListener("input", (e) => {
        let searchText = e.target.value.toLowerCase();

        if (filterSelect) filterSelect.value = "all";
        if (orderSearch) orderSearch.value = "";

        if (searchText === "") {
            Orders(orders);
        } else {
            let filteredOrders = orders.filter(order =>
                order.items.some(item => item.name.toLowerCase().includes(searchText))
            );
            Orders(filteredOrders);
        }
    });
    fillProductList(orders);


    // Filter Using OrderId::
    let orderSearch = document.getElementById("order_search");
    orderSearch.addEventListener("input", (e) => {
    let searchText = e.target.value.trim().toLowerCase();

    if (filterSelect) filterSelect.value = "all";
    if (productSearch) productSearch.value = "";

    
    if (searchText === "") {
            Orders(orders); 
        } else {
            let filteredOrders = orders.filter(order =>
                order.id.toString().toLowerCase().includes(searchText)
            );
            Orders(filteredOrders);
        }
    });

    // Filter Using SellerName::
    let sellerFilter = document.getElementById("seller_filter");

    //SellerName FroM Json 
    sellersData.forEach(seller => {
        let option = document.createElement("option");
        option.value = seller.name; 
        option.textContent = seller.name;
        sellerFilter.appendChild(option);
    });




    // Event
    sellerFilter.addEventListener("change", (e) => {
        let selectedSeller = e.target.value;
        
        // Delete All Fiters:
        if (filterSelect) filterSelect.value = "all";
        if (orderSearch) orderSearch.value = "";
        if (productSearch) productSearch.value = "";

        if (selectedSeller === "all") {
            Orders(orders);
        } else {
            let filteredOrders = orders.filter(order =>
                order.items.some(item => {
                    let sellerName = sellersMap.get(item.sellerId) || "";
                    return sellerName === selectedSeller;
                })
            );
            Orders(filteredOrders);
        }
    });








    // RefreshBTN::
    let refreshBtn = document.getElementById("refresh_btn");

    refreshBtn.addEventListener("click", () => {
        if (filterSelect) filterSelect.value = "all";
        if (orderSearch) orderSearch.value = "";
        if (productSearch) productSearch.value = "";

        Orders(orders);
    });

// })

    // .catch(error => console.error("Error loading:", error));






