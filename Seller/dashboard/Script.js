let sellers = [];
let products = [];
let revenueChart = null;
let incomeChart = null;


Promise.all([
  fetch("sellers.json").then(res => res.json()),
  fetch("products.json").then(res => res.json())
])
.then(([sellersData, productsData]) => {
  sellers = sellersData;
  products = productsData;

  
  localStorage.setItem("sellers", JSON.stringify(sellers));
  localStorage.setItem("products", JSON.stringify(products));

  
  if (sellers.length > 0) {
    updateDashboard(sellers[2].id);
  }
});


function updateDashboard(sellerId) {
  
  const sellerProducts = products.filter(p => p.sellerId == sellerId);


  const productStats = sellerProducts.map(p => ({
    name: p.name,
    quantity: p.totalQuantity,
    ordered: p.orderedItems,
    revenue: p.price * p.orderedItems
  }));

   const seller = sellers.find(s => s.id == sellerId);
  document.getElementById("name").textContent = seller ? seller.name : "Unknown Seller";

  console.log("Product Stats:", productStats);


  document.getElementById("totalProducts").textContent = sellerProducts.length;

  document.getElementById("totalRevenue").textContent =
    productStats.reduce((sum, p) => sum + p.revenue, 0).toLocaleString() + " EGP";

  const top = productStats.reduce((a, b) => (a.ordered > b.ordered ? a : b), { name: "-", ordered: 0 });
  document.getElementById("topProduct").textContent = top.name;

  document.getElementById("outOfStock").textContent = productStats.filter(p => p.quantity === 0).length;

  document.getElementById("lowStock").textContent = productStats.filter(p => p.quantity > 0 && p.quantity < 10).length;

  // Charts
  if (revenueChart) revenueChart.destroy();
  if (incomeChart) incomeChart.destroy();

  
  const ctx1 = document.getElementById("revenueChart").getContext("2d");
  revenueChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: productStats.map(p => p.name),
      datasets: [{
        data: productStats.map(p => p.revenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)"
        ]
      }]
    }
  });


  const ctx2 = document.getElementById("incomeChart").getContext("2d");
  incomeChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: productStats.map(p => p.name),
      datasets: [{
        label: "Total Income",
        data: productStats.map(p => p.revenue),
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}