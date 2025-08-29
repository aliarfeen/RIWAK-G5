window.addEventListener("DOMContentLoaded",function(){
    const products = localStorage.getItem("products");
    const categories = localStorage.getItem("categories")
    const users = localStorage.getItem("users")




    if(!products){
        console.log("products was not found!")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../assets/json/products.json", true);
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            localStorage.setItem("products", JSON.stringify(result));
            
        }
    }
    }
    if(!categories){
        console.log("categories was not found!")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../assets/json/categories.json", true);
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            localStorage.setItem("categories", JSON.stringify(result));
            
        }
    }
    }
    
    if(!users){
        console.log("users were not found!")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../assets/json/users.json", true);
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(xhr.responseText);
            localStorage.setItem("users", JSON.stringify(result));
            
        }
    }
    }
});


