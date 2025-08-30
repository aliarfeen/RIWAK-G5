window.addEventListener("DOMContentLoaded", function () {
  const products = localStorage.getItem("products");
  const categories = localStorage.getItem("categories");
  const users = localStorage.getItem("users");

  if (!products) {
    console.log("products was not found!");
    let xhrProducts = new XMLHttpRequest();
    xhrProducts.open("GET", "../assets/json/products.json", true);
    xhrProducts.send("");
    xhrProducts.onreadystatechange = function () {
      if (xhrProducts.readyState === 4 && xhrProducts.status === 200) {
        localStorage.setItem("products", xhrProducts.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  if (!categories) {
    console.log("categories was not found!");
    let xhrCategories = new XMLHttpRequest();
    xhrCategories.open("GET", "../assets/json/categories.json", true);
    xhrCategories.send("");
    xhrCategories.onreadystatechange = function () {
      if (xhrCategories.readyState === 4 && xhrCategories.status === 200) {
        localStorage.setItem("categories", xhrCategories.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  if (!users) {
    console.log("users were not found!");
    let xhrUsers = new XMLHttpRequest();
    xhrUsers.open("GET", "../assets/json/users.json", true);
    xhrUsers.send("");
    xhrUsers.onreadystatechange = function () {
      if (xhrUsers.readyState === 4 && xhrUsers.status === 200) {
        localStorage.setItem("users", xhrUsers.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }
  
});
