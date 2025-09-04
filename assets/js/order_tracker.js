document.addEventListener("DOMContentLoaded", () => {
  const orderId = localStorage.getItem("current_order_id");
  if (!orderId) {
    console.error("No order id found in localStorage");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(o => o.order_details.id === orderId)?.order_details;

  if (!order) {
    console.error("Order not found for id:", orderId);
    return;
  }

  console.log("Loaded order:", order);
  localStorage.setItem("cart", JSON.stringify([]));

  const progress = document.getElementById("progress");
  const trackingProgressDiv = document.getElementById("tracking-progress");

  if (order.status === "confirmed") {
    progress.style.width = "0%";
  } else if (order.status === "shipped") {
    progress.style.width = "50%";
  } else if (order.status === "delivered") {
    progress.style.width = "100%";
  } else if (order.status === "cancelled") {
    trackingProgressDiv.innerHTML = "<h1> YOUR ORDER WAS CANCELLED</h1>";
  } else {
    trackingProgressDiv.innerHTML = "<h1> SOMETHING WENT WRONG</h1>";
  }

  const checkOutDetails = document.getElementById("check-out-details");

  order.items.forEach((e) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("mt-3", "d-flex", "justify-content-between");
    newDiv.innerHTML = `
       <p class="item-name">${e.name}</p> 
       <p>${e.quantity} Pcs</p>
    `;
    checkOutDetails.appendChild(newDiv);
  });

  let totalDiv = document.createElement("div");
  totalDiv.classList.add("mt-3");
  totalDiv.innerHTML = `
       <p class="item-name"> Total Sum : <b>${order.totalAmount}</b></p>
  `;
  checkOutDetails.appendChild(totalDiv);

  const orderIdElement = document.getElementById("order_id");
  orderIdElement.textContent = order.shippingInfo.trackingNumber;
});
