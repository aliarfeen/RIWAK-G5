const aboutImg = document.querySelector(".aboutus_img img");
const images = [
    "/assets/images/about_img/Image 6.jpg",
    "/assets/images/about_img/Image 7.jpg",
    "/assets/images/about_img/Image 1.jpg"
];

let index = 0;

setInterval(() => {
    index = (index + 1) % images.length;
    aboutImg.src = images[index];
}, 3000); 