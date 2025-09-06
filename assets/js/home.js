// Reveal In Header::

ScrollReveal().reveal(".hero_title", {
  origin: "right",
  distance: "100px",
  duration: 1000,
  delay: 200,
  easing: "ease-in-out",
  reset: true,
});

ScrollReveal().reveal(".hero_text", {
  origin: "right",
  distance: "100px",
  duration: 1000,
  delay: 400,
  easing: "ease-in-out",
  reset: true,
});

ScrollReveal().reveal(".hero_btn", {
  origin: "bottom",
  distance: "60px",
  duration: 1000,
  delay: 600,
  easing: "ease-in-out",
  reset: true,
});

// Reveal In Home Menu
ScrollReveal().reveal(".items_container", {
  origin: "bottom",
  distance: "40px",
  duration: 800,
  interval: 100,
  easing: "ease-in-out",
  reset: true,
});

// Reveal In Content
ScrollReveal().reveal(".cont_imgs img", {
  origin: "bottom",
  distance: "80px",
  duration: 1200,
  easing: "ease-out",
  interval: 300,
  reset: true,
});

ScrollReveal().reveal(
  ".cont_detail .header_cont, .cont_detail p, .cont_features .feature",
  {
    origin: "right",
    distance: "100px",
    duration: 1000,
    interval: 300,
    easing: "ease-in-out",
    reset: true,
  }
);

ScrollReveal().reveal(".content_btn", {
  origin: "bottom",
  distance: "60px",
  duration: 1200,
  delay: 800,
  easing: "ease-in-out",
  reset: true,
});

document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: { delay: 2000 },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "slide",
  });
});

const productsJson = localStorage.getItem("products");
let Alldata = JSON.parse(productsJson);

const match = document.querySelector(".port_cards");
Alldata.slice(0, 12).forEach((data) => {
  const c = Math.floor(Math.random() * data.images.length);
  match.innerHTML += `





  
        <div class="port_card">

          <div class="port_card_img">
            <img src="${data.images[c]}" alt="${data.name}"/>
            <button class=' btn_details '
            data-id="${data.id}">Detalis</button>
          </div>


          <div class="port_card_info">

            <div class="port_card_data">

              <h5>${data.name}</h4>
                <div class="port_card_rate">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>

            </div>

            <p>${data.price} <span>EGP</span></p>

          </div>
        </div>
      `;
});

document.querySelectorAll(".buy-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.id;
    const product = Alldata.find((p) => p.id == productId);
    localStorage.setItem("details", JSON.stringify(product));
    window.location.href = "product_details.html";
  });
});

const categoriesJson = localStorage.getItem("categories");
let categories = JSON.parse(categoriesJson);
const categoryContainer = document.querySelector(".row");

categories.forEach((category) => {
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
