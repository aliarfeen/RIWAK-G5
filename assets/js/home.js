document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: { delay: 2000 },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: "slide"
  });
});


const productsJson = localStorage.getItem("products")
let Alldata = JSON.parse(productsJson);

const match = document.querySelector('.cards');
Alldata.slice(0, 10).forEach(data => {
  const c = Math.floor(Math.random() * data.images.length);
  match.innerHTML += `
        <div class="card animate__animated animate__pulse" style="width: 18rem;">
          <img src="${data.images[c]}" class="card-img-top" alt="${data.name}">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">${data.price} EGP</p>
            <button 
              type="button"  
              class=" p-2 mb-3 mt-2 buy-btn" 
              data-id="${data.id}">
              Buy
            </button>
          </div>
        </div>
      `;
});


document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.id;
    const product = Alldata.find(p => p.id == productId);
    localStorage.setItem("details", JSON.stringify(product));
    window.location.href = "product_details.html";
  });
});



const categoriesJson = localStorage.getItem("categories")
let categories = JSON.parse(categoriesJson);
const categoryContainer = document.querySelector('.row');

categories.forEach(category => {
  categoryContainer.innerHTML += `
    <div class="col-md-4 mb-3">
      <div class="card text-center p-3">
        <div class="card-body">
          <i class="fa-solid ${category.icon} fa-3x mb-3"></i>
          <h5 class="card-title">${category.name}</h5>
          <p class="card-text">${category.description}</p>
        </div>
      </div>
    </div>
  `;
});

document.getElementById("discoverBtn").addEventListener("click", function () {
  window.location.href = "products.html";
});

