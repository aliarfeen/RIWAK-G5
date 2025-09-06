// Order status:
//     PENDING
//     CONFIRMED
//     PROCESSING
//     SHIPPED
//     DELIVERED
//     CANCELLED




// get data from file json (orders.json):


document.addEventListener('DOMContentLoaded', function () {
      // ...
const adminDataString = localStorage.getItem('current_admin');

if (adminDataString) {
    const adminUser = JSON.parse(adminDataString);
    document.getElementById('admin-username').textContent = adminUser.name;
}
});
    let ordersData = JSON.parse(localStorage.getItem("orders"));
    let sellersData = JSON.parse(localStorage.getItem("sellers"));

    console.log(ordersData);
    
    let container = document.getElementById("order_lists");

    // Filters
    let statusFilter = document.getElementById("status_filter");
    let sellerFilter = document.getElementById("seller_filter");


    // Maping For seller ::

    let sellersMap = new Map();
    sellersData.forEach(seller => {
        sellersMap.set(seller.id, seller.name);
    });


    // .........Convert object to array : 

    let orders = ordersData.map(item => {
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

    console.log(orders);


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


            // Update in orders (the mapped array)
            let orderObj = orders.find(o => o.id == orderId);
            if (orderObj) {
                orderObj.status = newStatus;
            }


            // Update in ordersData (the raw data from localStorage)
            let orderDataObj = ordersData.find(o => o.order_details.id == orderId);
            if (orderDataObj) {
                orderDataObj.order_details.status = newStatus;
            }

            localStorage.setItem("orders", JSON.stringify(ordersData));

            update.style.display = "none"; 
        }
    });

    // Cancel Btn
    cancelBtn.addEventListener("click", () => {
        update.style.display = "none";
    });

    Orders(orders);



    // .............Filters...............

    // Filter Using Status ::

    statusFilter.addEventListener("change", (e) => {
        let selectedStatus = e.target.value.toLowerCase();

        if (orderSearch) orderSearch.value = "";
        if (productSearch) productSearch.value = "";
        if (sellerFilter) sellerFilter.value = "all";

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

        if (statusFilter) statusFilter.value = "all";
        if (orderSearch) orderSearch.value = "";
        if (sellerFilter) sellerFilter.value = "all";

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

    if (statusFilter) statusFilter.value = "all";
    if (productSearch) productSearch.value = "";
    if (sellerFilter) sellerFilter.value = "all";

    
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

    //SellerName From Json 
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
        if (statusFilter) statusFilter.value = "all";
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
        if (statusFilter) statusFilter.value = "all";
        if (orderSearch) orderSearch.value = "";
        if (productSearch) productSearch.value = "";

        Orders(orders);
    });
    // Add this code to the end of your Order_page.js file

document.getElementById('sign-out-btn').addEventListener('click', function(e) { 
    e.preventDefault(); // To prevent default link behavior
    
    console.log('Logging out...');  
    
    // Remove the admin's session data from local storage
    localStorage.removeItem('current_admin'); 
    
    // Redirect to the home page
    window.location.href = '/home.html'; 
});








