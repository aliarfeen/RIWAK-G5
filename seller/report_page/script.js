let currentSeller = localStorage.getItem("current_seller");

if (!currentSeller) {
  window.location.href = "../dashboard/login.html";
}

(function loadSellerName() {
  let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
  let currentSeller = localStorage.getItem("current_seller");
  currentSeller = currentSeller ? JSON.parse(currentSeller) : null;

  let seller = sellers.find(s => s.id == currentSeller?.id);

  let nameDiv = document.getElementById("name");
  if (nameDiv) {
    nameDiv.textContent = seller ? seller.name : "Unknown Seller";
  }
})();


async function salesReport() {
  let currentSeller = localStorage.getItem("current_seller");
  currentSeller = JSON.parse(currentSeller);

  // المنتجات من localStorage بدل fetch
  let data = JSON.parse(localStorage.getItem("products")) || [];

  let sellerProducts = data.filter(
    p => p.sellerId == currentSeller.id && p.orderedItems > 0
  );

  if (sellerProducts.length === 0) {
 
    let tbody = document.querySelector("#first-table");
    if (tbody) {
      let row = document.createElement("tr");
      row.innerHTML = `<td colspan="11" style="text-align:center; color:gray;">مفيش منتجات للبائع ده</td>`;
      tbody.appendChild(row);
    }
    return;
  }

  

  let tbody = document.querySelector("#first-table");
  let totalRev = [];

  sellerProducts.forEach(p => {
    let totalRevenue = p.price * (p.orderedItems + p.refund);
    let profitPerItem = p.price - p.cost + 25;
    let totalIncome = profitPerItem * p.orderedItems + (p.refund * 25);
    let markupPercentage = ((p.price - p.cost) / p.cost) * 100;

    totalRev.push(totalRevenue);

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.cost} EGP</td>
      <td>${markupPercentage.toFixed(2)}%</td>
      <td>${p.orderedItems}</td>
      <td>${totalRevenue.toFixed(2)} EGP</td>
      <td>50 EGP</td>
      <td>25 EGP</td>
      <td>${profitPerItem} EGP</td>
      <td>${p.refund}</td>
      <td>${totalIncome.toFixed(2)} EGP</td>
    `;
    tbody.appendChild(row);
  });

  let ravenueHeader = document.getElementById("ravenueHeader");
  sellerProducts.forEach(p => {
    let th = document.createElement("th");
    th.textContent = p.name;
    ravenueHeader.appendChild(th);
  });

  let revenueRow = document.getElementById("revenueRow");
  for (let i = 0; i < totalRev.length; i++) {
    let td = document.createElement("td");
    td.textContent = totalRev[i].toFixed(2) + " EGP";
    revenueRow.appendChild(td);
  }

  let allTh = document.createElement("th");
  allTh.textContent = "All";
  ravenueHeader.appendChild(allTh);

  let allTd = document.createElement("td");
  let totalAll = totalRev.reduce((sum, v) => sum + v, 0);
  allTd.textContent = totalAll.toFixed(2) + " EGP";
  revenueRow.appendChild(allTd);

  let percent = document.getElementById("percent");
  let percentages = totalRev.map(v => (v / totalAll) * 100);
  for (let i = 0; i < percentages.length; i++) {
    let td = document.createElement("td");
    td.textContent = percentages[i].toFixed(2) + " %";
    percent.appendChild(td);
  }

  let allPercent = document.createElement("td");
  allPercent.textContent = "100%";
  percent.appendChild(allPercent);
}

salesReport();

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("current_seller");
  window.location.href = "../dashboard/login.html";
});
