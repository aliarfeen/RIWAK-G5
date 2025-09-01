document.addEventListener("DOMContentLoaded", () => {
  const orderJson = localStorage.getItem("order_details");
  const order = JSON.parse(orderJson).order_details;
  console.log(order);
  localStorage.setItem("cart", JSON.stringify([]));
  const orderItems = order.items;
  const progress = document.getElementById("progress");
  const trackingProgressDiv = document.getElementById("tracking-progress");
    if(order.status === "CONFIRMED"){
        
  progress.style.width = "0%";
  
    }else if(order.status ==="SHIPPED"){
      
  progress.style.width = "50%";
    }else if(order.status ==="DELIVERED"){
      
  progress.style.width = "100%";

    } else if(order.status ==="CANCELLED"){
      
  trackingProgressDiv.innerHTML = "<h1> YOUR ORDER WAS CANCELLED</h1>"
    }else{
  trackingProgressDiv.innerHTML = "<h1> SOMETHING WENT WRONG</h1>"

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
