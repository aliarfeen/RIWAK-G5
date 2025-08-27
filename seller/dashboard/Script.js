let sellers = [];
let products = [];
let revenueChart = null;
let incomeChart = null;


Promise.all([
  fetch("../assets/json/sellers.json").then(res => res.json()),
  fetch("../assets/json/products.json").then(res => res.json())
])
.then(([sellersData, productsData]) => {
  sellers = sellersData;
  products = productsData;

  localStorage.setItem("sellers", JSON.stringify(sellers));
  localStorage.setItem("products", JSON.stringify(products));

  
  const currentSeller = JSON.parse(localStorage.getItem("current_seller"));
  if (currentSeller) {
    updateDashboard(currentSeller.id);
  }
});



(function () {
  const form = document.getElementById('loginForm');

 
  form.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
      if (el.checkValidity()) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
      }
    });
  });

  
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    
    const seller = sellers.find(s => s.email === email && s.password === password);

    if (!seller) {
      alert("Account not exist!");
      return;
    }

   
    localStorage.setItem("current_seller", JSON.stringify({
      id: seller.id,
      email: seller.email
    }));

    
    updateDashboard(seller.id);

    alert("Login successful!");
  }, false);
})();



const pwd = document.getElementById('password');
const toggle = document.getElementById('togglePwd');
toggle.addEventListener('click', () => {
  const isHidden = pwd.type === 'password';
  pwd.type = isHidden ? 'text' : 'password';
  toggle.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
  toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  pwd.focus();
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

  document.getElementById("totalProducts").textContent = sellerProducts.length;
  document.getElementById("totalRevenue").textContent =
    productStats.reduce((sum, p) => sum + p.revenue, 0).toLocaleString() + " EGP";

  const top = productStats.reduce((a, b) => (a.ordered > b.ordered ? a : b), { name: "-", ordered: 0 });
  document.getElementById("topProduct").textContent = top.name;

  document.getElementById("outOfStock").textContent = productStats.filter(p => p.quantity === 0).length;
  document.getElementById("lowStock").textContent = productStats.filter(p => p.quantity > 0 && p.quantity < 10).length;


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
