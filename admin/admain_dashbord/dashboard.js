document.addEventListener('DOMContentLoaded', function () {
        const loggedInUser = "Ahmed";
        document.getElementById('admin-username').textContent = loggedInUser;
        
        let categoriesChart, sellersChart, calculatedMetrics;
        let allProductsData = [], allOrdersData = [], sellerNameMap = new Map(), productNameMap = new Map();
        
        async function loadAndProcessData() {
            try {
                // const [products, orders, newOrders, sellers] = await Promise.all([
                //     fetch('products.json').then(res => res.json()),
                //     fetch('orders.json').then(res => res.json()),
                //     fetch('orders_new.json').then(res => res.json()),
                //     fetch('sellers.json').then(res => res.json())
                // ]);
                

                // allProductsData = products;
                // allOrdersData = [...orders, ...newOrders];
                // sellerNameMap = new Map(sellers.map(s => [s.id, s.name]));
                // productNameMap = new Map(products.map(p => [p.id, {name: p.name, price: p.price, cost: p.cost}]));


                products=JSON.parse(localStorage.getItem("products"));
                allProductsData = products;

                orders=JSON.parse(localStorage.getItem("orders"));
                allOrdersData = [...orders];

                sellers=JSON.parse(localStorage.getItem("sellers"));

                sellerNameMap = new Map(sellers.map(s => [s.id, s.name]));
                productNameMap = new Map(products.map(p => [p.id, {name: p.name, price: p.price, cost: p.cost}]));
                
                calculatedMetrics = calculateDashboardMetrics();
                updateUI();
                initializeCardClickHandlers();

            } catch (error) { console.error("Error loading or processing data:", error); }
        }


        function calculateDashboardMetrics() {
            const yearlyOrders = allOrdersData;
            
            // Sales Metrics
            const grandTotalSales = allOrdersData.reduce((sum, o) => sum + o.order_details.totalAmount, 0);


            // General & Detailed Metrics
            const categorySales = {}, categoryQuantities = {}, sellerStats = {}, productStats = {};
            
            yearlyOrders.forEach(order => {
                order.order_details.items.forEach(item => {
                    const pInfo = allProductsData.find(p => p.id === item.productId);
                    if(pInfo) {
                        categorySales[pInfo.category] = (categorySales[pInfo.category] || 0) + item.total;
                        categoryQuantities[pInfo.category] = (categoryQuantities[pInfo.category] || 0) + item.quantity;
                    }
                    const sName = sellerNameMap.get(item.sellerId) || `Seller ${item.sellerId}`;
                    if(!sellerStats[sName]) sellerStats[sName] = {revenue:0, itemsSold:0};
                    sellerStats[sName].revenue += item.total;
                    sellerStats[sName].itemsSold += item.quantity;

                    if(!productStats[item.productId]) {
                        const prodInfo = productNameMap.get(item.productId);
                        productStats[item.productId] = {id: item.productId, name:prodInfo?.name, price:prodInfo?.price, cost: prodInfo?.cost, quantitySold:0};
                    }
                    productStats[item.productId].quantitySold += item.quantity;
                });
            });

            // Product Metrics
            const productsByCategory = allProductsData.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {});

            // Order Metrics
            const orderStatusSummary = allOrdersData.reduce((acc, o) => {
                const status = o.order_details.statusHistory ? o.order_details.statusHistory.slice(-1)[0].status : 'pending';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});
            
            // Customer Metrics
            const yearlyAddresses = yearlyOrders.map(o => o.order_details.shippingInfo.address);
            const customerCounts = yearlyAddresses.reduce((acc, addr) => { acc[addr] = (acc[addr] || 0) + 1; return acc; }, {});
            const uniqueCustomersYear = Object.keys(customerCounts).length;
            const allCustomerSpending = Object.entries(yearlyOrders.reduce((acc, o) => {
                const addr = o.order_details.shippingInfo.address;
                acc[addr] = (acc[addr] || 0) + o.order_details.totalAmount;
                return acc;
            }, {})).sort(([,a],[,b]) => b-a);

            const getTopN = (data, metric, n) => Object.entries(data).sort(([,a],[,b])=>b[metric]-a[metric]).slice(0,n);
            const topSellersForChartData = getTopN(sellerStats, 'revenue', 5);

            return {
                grandTotalSales,
                totalProducts: allProductsData.length,
                productsByCategory,
                ordersThisYear: yearlyOrders.length,
                orderStatusSummary,
                customersThisYear: uniqueCustomersYear,
                allCustomerSpending,
                topCategoriesByRevenue: {labels: Object.keys(categorySales).sort((a,b)=>categorySales[b]-categorySales[a]), data: Object.values(categorySales).sort((a,b)=>b-a)},
                topCategoriesByQuantity: {labels: Object.keys(categoryQuantities).sort((a,b)=>categoryQuantities[b]-categoryQuantities[a]), data: Object.values(categoryQuantities).sort((a,b)=>b-a)},
                topSellersForChart: {labels: topSellersForChartData.map(s=>s[0]), data: topSellersForChartData.map(s=>s[1].revenue)},
                topSellersList: getTopN(sellerStats, 'revenue', 2).map(([name, data])=>({name, ...data})),
                topProductsList: Object.values(productStats).sort((a,b)=>b.quantitySold-a.quantitySold).slice(0,5)
            };
        }

        function updateUI() {
            // Card: Products
            document.getElementById('products-card').innerHTML = `
                <p>Total Products</p>
                <h2>${calculatedMetrics.totalProducts}</h2>
            `;
            // Card: Sales
            document.getElementById('sales-card').innerHTML = `
                <p>Total Sales</p>
                <h2>${calculatedMetrics.grandTotalSales.toLocaleString('en-US')} EGP</h2>
            `;
            // Card: Orders
            document.getElementById('orders-card').innerHTML = `
                <p>Orders</p>
                <h2>${calculatedMetrics.ordersThisYear}</h2>
            `;
            // Card: Customers
            document.getElementById('customers-card').innerHTML = `
                <p>Customers</p>
                <h2>${calculatedMetrics.customersThisYear}</h2>
            `;
            
            const originalChartColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'];
            if(categoriesChart) categoriesChart.destroy();
            const categoriesCtx = document.getElementById('categories-chart').getContext('2d'); 
            categoriesChart = new Chart(categoriesCtx, {type: 'doughnut', data: {labels: calculatedMetrics.topCategoriesByRevenue.labels, datasets: [{ data: calculatedMetrics.topCategoriesByRevenue.data, backgroundColor: originalChartColors, hoverOffset: 4, borderWidth: 0 }]}, options: { responsive: true, cutout: '60%', plugins: { legend: { display: false } } } });

            if(sellersChart) sellersChart.destroy();
            const sellersCtx = document.getElementById('sellers-chart').getContext('2d');
            sellersChart = new Chart(sellersCtx, {type: 'bar', data: {labels: calculatedMetrics.topSellersForChart.labels, datasets: [{ label: 'Sales', data: calculatedMetrics.topSellersForChart.data, backgroundColor: '#4e73df', borderRadius: 4 }]}, options: { responsive: true, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } } });
            
            document.getElementById('top-sellers-list').innerHTML = calculatedMetrics.topSellersList.map(s => `
    <div class="d-flex justify-content-between align-items-center border-bottom py-3">
        <div>
            <div class="fw-semibold" style="font-size:1.08rem">${s.name}</div>
            <div class="text-muted" style="font-size:0.95rem">${s.itemsSold} items sold</div>
        </div>
        <div class="fw-bold" style="font-size:1.15rem">${s.revenue.toLocaleString()} EGP</div>
    </div>
`).join('');

            document.getElementById('top-products-list').innerHTML = calculatedMetrics.topProductsList.map(p => `<div class="list-group-item"><div class="item-info"><p class="name">${p.name}</p><p class="details">Price: ${p.price.toLocaleString('en-US')} EGP</p></div><div class="item-metric">${p.quantitySold} ordered</div></div>`).join('');
        }
        
        document.getElementById('category-filter').addEventListener('change', function(e) {
            const val = e.target.value;
            const chartData = (val === 'revenue') ? calculatedMetrics.topCategoriesByRevenue : calculatedMetrics.topCategoriesByQuantity;
            categoriesChart.data.labels = chartData.labels;
            categoriesChart.data.datasets[0].data = chartData.data;
            categoriesChart.update();
        });

        function initializeCardClickHandlers() {
            const modalElement = document.getElementById('detailsModal');
            const detailsModal = new bootstrap.Modal(modalElement);
            const modalTitle = document.getElementById('detailsModalLabel');
            const modalBody = document.getElementById('detailsModalBody');

            // Products Card
            document.getElementById('products-card').addEventListener('click', () => {
                modalTitle.textContent = 'Product Summary by Category';
                let content = `
                    <table class="table table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>Category</th>
                                <th>Number of Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(calculatedMetrics.productsByCategory).map(([category, count]) => `
                                <tr>
                                    <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                                    <td>${count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                modalBody.innerHTML = content;
                detailsModal.show();
            });

            // Sales Card
            document.getElementById('sales-card').addEventListener('click', () => {
                modalTitle.textContent = 'Sales by Category';
                const categorySales = {};
                const categoryItemsSold = {};
                allOrdersData.forEach(order => {
                    order.order_details.items.forEach(item => {
                        const product = allProductsData.find(p => p.id === item.productId);
                        if (product) {
                            const cat = product.category;
                            categoryItemsSold[cat] = (categoryItemsSold[cat] || 0) + item.quantity;
                            categorySales[cat] = (categorySales[cat] || 0) + (item.quantity * (product.price || 0));
                        }
                    });
                });

                let content = `
                    <table class="table table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>Category</th>
                                <th>Number of Items Sold</th>
                                <th>Total Sales (EGP)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.keys(categoryItemsSold).map(cat => `
                                <tr>
                                    <td>${cat.charAt(0).toUpperCase() + cat.slice(1)}</td>
                                    <td>${categoryItemsSold[cat]}</td>
                                    <td>${categorySales[cat].toLocaleString('en-US')} EGP</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                modalBody.innerHTML = content;
                detailsModal.show();
            });
            
            //  ORDERS CARD 
            
            function renderOrderSummaryView() {
                modalTitle.textContent = 'Order Fulfillment Summary';
                modalBody.innerHTML = `
                    <h5>Orders by Status</h5>
                    <ul class="list-group mb-4">
                        <li class="list-group-item d-flex justify-content-between align-items-center status-link" data-status="pending" style="cursor: pointer;">Pending <span class="badge bg-warning text-dark rounded-pill">${calculatedMetrics.orderStatusSummary.pending || 0}</span></li>
                        <li class="list-group-item d-flex justify-content-between align-items-center status-link" data-status="processing" style="cursor: pointer;">Processing <span class="badge bg-info rounded-pill">${calculatedMetrics.orderStatusSummary.processing || 0}</span></li>
                        <li class="list-group-item d-flex justify-content-between align-items-center status-link" data-status="shipped" style="cursor: pointer;">Shipped <span class="badge bg-primary rounded-pill">${calculatedMetrics.orderStatusSummary.shipped || 0}</span></li>
                        <li class="list-group-item d-flex justify-content-between align-items-center status-link" data-status="delivered" style="cursor: pointer;">Delivered <span class="badge bg-success rounded-pill">${calculatedMetrics.orderStatusSummary.delivered || 0}</span></li>
                    </ul>
                `;
            }

            function renderOrderStatusView(status) {
                modalTitle.textContent = `${status.charAt(0).toUpperCase() + status.slice(1)} Orders`;
                
                const filteredOrders = allOrdersData.filter(o => {
                    const currentStatus = o.order_details.statusHistory ? o.order_details.statusHistory.slice(-1)[0].status : 'pending';
                    return currentStatus === status;
                });

                let tableContent;
                if (filteredOrders.length > 0) {
                    tableContent = filteredOrders.map(o => `
                        <tr>
                            <td>${o.order_details.id}</td>
                            <td>${o.order_details.date}</td>
                            <td>${o.order_details.shippingInfo.address}</td>
                            <td>${o.order_details.totalAmount.toLocaleString('en-US')} EGP</td>
                        </tr>
                    `).join('');
                } else {
                    tableContent = '<tr><td colspan="4" class="text-center">No orders found with this status.</td></tr>';
                }

                modalBody.innerHTML = `
                    <button id="back-to-summary-btn" class="btn btn-secondary btn-sm mb-3">&larr; Back to Summary</button>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Shipping Address</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableContent}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            document.getElementById('orders-card').addEventListener('click', () => {
                renderOrderSummaryView();
                detailsModal.show();
            });

            modalBody.addEventListener('click', (e) => {
                const statusLink = e.target.closest('.status-link');
                const backButton = e.target.closest('#back-to-summary-btn');

                if (statusLink) {
                    const status = statusLink.dataset.status;
                    renderOrderStatusView(status);
                } else if (backButton) {
                    renderOrderSummaryView();
                }
            });
            

            // Customers Card
            document.getElementById('customers-card').addEventListener('click', () => {
                modalTitle.textContent = 'Customer Purchase Summary';

                const tableRows = calculatedMetrics.allCustomerSpending.map(([address, total]) => `
                    <tr>
                        <td>${address}</td>
                        <td>${total.toLocaleString('en-US')} EGP</td>
                    </tr>
                `).join('');

                modalBody.innerHTML = `
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th>Customer (Shipping Address)</th>
                                    <th>Total Purchases</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                `;
                detailsModal.show();
            });
        }
        
        loadAndProcessData();
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        const pageContents = document.querySelectorAll('.page-content');
        navLinks.forEach(link => { link.addEventListener('click', function() { const targetId = this.getAttribute('data-target'); navLinks.forEach(l=>l.parentElement.classList.remove('active')); pageContents.forEach(p=>p.classList.remove('active')); this.parentElement.classList.add('active'); document.getElementById(targetId).classList.add('active'); }); });
        document.getElementById('sign-out-btn').addEventListener('click', function(e) { e.preventDefault(); console.log('Logging out...'); window.location.href = 'login.html'; });
    });