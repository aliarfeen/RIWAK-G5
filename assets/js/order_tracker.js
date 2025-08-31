document.addEventListener("DOMContentLoaded", () => {
  const orderJson = localStorage.getItem("order_details");
  const order = JSON.parse(orderJson);
  console.log(order);
<<<<<<< HEAD
=======
  localStorage.setItem("cart", JSON.stringify([]));
>>>>>>> admin-hyperlinking
  const orderItems = order.items;
  const progress = document.getElementById("progress");
    if(order.status === "pending"){
        
  progress.style.width = "100%";
  
    }

  orderItems.map((e) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("mt-3");
    newDiv.classList.add("d-flex");
    newDiv.classList.add("justify-content-between");

    newDiv.innerHTML = `
      
       <p class="item-name" >${e.name}</p> <p> ${e.quantity} Pcs</p>
    `;
    let checkOutDetails = document.getElementById("check-out-details");
    checkOutDetails.appendChild(newDiv);
  });

  let newDiv = document.createElement("div");
  newDiv.classList.add("mt-3");

  newDiv.innerHTML = `
      
       <p class="item-name" > Total Sum : <b>${order.totalAmount}</b></p>
    `;
  let checkOutDetails = document.getElementById("check-out-details");
  checkOutDetails.appendChild(newDiv);
  const orderId = document.getElementById("order_id");
  orderId.textContent = order.shippingInfo.trackingNumber;
});
