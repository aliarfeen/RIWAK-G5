window.addEventListener("DOMContentLoaded", function () {
  const products = localStorage.getItem("products");
  const categories = localStorage.getItem("categories");
  const users = localStorage.getItem("users");
  const orders = localStorage.getItem("orders");
  const admins = localStorage.getItem("admins");
  const sellers = localStorage.getItem("sellers");



  if (!products) {
    console.log("products was not found!");
    let xhrProducts = new XMLHttpRequest();
    xhrProducts.open("GET", "../../assets/json/products.json", true);
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
    xhrCategories.open("GET", "../../assets/json/categories.json", true);
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

  if (!orders) {
    console.log("orders was not found!");
    let xhrOrders = new XMLHttpRequest();
    xhrOrders.open("GET", "../../assets/json/orders.json", true);
    xhrOrders.send("");
    xhrOrders.onreadystatechange = function () {
      if (xhrOrders.readyState === 4 && xhrOrders.status === 200) {
        localStorage.setItem("orders", xhrOrders.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  if (!users) {
    console.log("users were not found!");
    let xhrUsers = new XMLHttpRequest();
    xhrUsers.open("GET", "../../assets/json/users.json", true);
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

  
  if (!admins) {
    console.log("admins were not found!");
    let xhradmins = new XMLHttpRequest();
    xhradmins.open("GET", "../../assets/json/admins.json", true);
    xhradmins.send("");
    xhradmins.onreadystatechange = function () {
      if (xhradmins.readyState === 4 && xhradmins.status === 200) {
        localStorage.setItem("admins", xhradmins.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  if (!sellers) {
    console.log("sellers were not found!");
    let xhrsellers = new XMLHttpRequest();
    xhrsellers.open("GET", "../../assets/json/sellers.json", true);
    xhrsellers.send("");
    xhrsellers.onreadystatechange = function () {
      if (xhrsellers.readyState === 4 && xhrsellers.status === 200) {
        localStorage.setItem("sellers", xhrsellers.responseText);
      }
    };
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

});

  if (!localStorage.getItem('current_admin')) {
            // إذا لم يتم العثور على بيانات المدير، قم بإعادة التوجيه فوراً
            // استخدام "replace" يمنع المستخدم من الضغط على "رجوع" والعودة لهذه الصفحة مرة أخرى
            window.location.replace('/login.html'); // <-- تأكد من وضع المسار الصحيح لصفحة تسجيل الدخول
        }
