// نفترض إن الـ seller عمل تسجيل دخول قبل كده
// و خزنّا الـ sellerId بتاعه (كـ رقم) في localStorage
// (ممكن تجيبها من الـ login page)
const currentSellerId = parseInt(localStorage.getItem("current_seller")) || 1;


fetch("/assets/json/sellers.json")
  .then(res => res.json())
  .then(sellers => {
    let seller = sellers.find(s => s.id === currentSellerId);
    let nameDiv = document.getElementById("name");
    if (nameDiv) {
      nameDiv.textContent = seller ? seller.name : "Unknown Seller";
    }
  })
  .catch(err => console.error("Error loading sellers:", err));


fetch("/assets/json/orders.json")
  .then(res => res.json())
  .then(data => {
    let container = document.getElementById("order_lists");

    if (!container) {
      console.error("Container with id 'order_lists' not found!");
      return;
    }

    // فلترة الاوردرات الخاصة بالـ current seller
    let sellerOrders = data.filter(order => order.sellerId === currentSellerId);

    if (sellerOrders.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:gray;">No orders found for this seller.</p>`;
      return;
    }

    // عرض الأوردرات
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
        </div>
      `;

      container.innerHTML += orderHTML;
    });

    // باقي كود الـ popup زي ما هو
    let update = document.getElementById("update_status");
    let cancelBtn = document.getElementById("cancel_btn");
    let saveBtn = document.getElementById("save_btn");

    let statusSpan = document.querySelector("#update_status .status_id span"); 
    let statusSelect = document.getElementById("status_select");

    let currentOrderEl = null;

   document.querySelectorAll(".order_icons i").forEach(icon => {
  icon.addEventListener("click", (e) => {
    // نتأكد إن اللي اتضغط عليه هو pen بس
    if (!e.target.classList.contains("fa-pen-to-square")) {
      return; // باقي الايكونات متعملش حاجه
    }

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

        update.style.display = "none"; 
      }
    });

    cancelBtn.addEventListener("click", () => {
      update.style.display = "none";
    });
  })
  .catch(error => console.error("Error loading:", error));




