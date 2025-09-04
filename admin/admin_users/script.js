
//when tab cusromer is clicked, everything seller is turned customer
document.querySelector('a[href="#customersGrid"]').addEventListener("click", () => {
document.querySelectorAll(".sellerToCustomer").forEach(el => {
el.textContent = el.textContent.replace("Seller", "Customer");
  });
  //clearing search and refilling grids(may remove later)
  searchInput.value = "";
  document.getElementById("messageDiv").innerHTML = "";
  All();
});

document.querySelector('a[href="#sellersGrid"]').addEventListener("click", () => {
document.querySelectorAll(".sellerToCustomer").forEach(el => {
el.textContent = el.textContent.replace("Customer", "Seller");
  });
  searchInput.value = "";
  document.getElementById("messageDiv").innerHTML = "";
  All();
});

//json into local storage

// async function sellersToLocalStorage() {
// let sellersResponse = await fetch("sellers.json");
// let sellersData = await sellersResponse.json();
// localStorage.setItem("sellersData", JSON.stringify(sellersData));
// return sellersData;
// };

// let sellersData =JSON.parse(localStorage.getItem("sellers"));
// let usersData =JSON.parse(localStorage.getItem("users"));


// async function usersToLocalStorage() {
// let usersResponse = await fetch("users.json");
// let usersData = await usersResponse.json();
// localStorage.setItem("usersData", JSON.stringify(usersData));
// return usersData;
// };

async function All() {
    let sellers = JSON.parse(localStorage.getItem("sellers"));
    // if (!sellers){
    //     sellers = await sellersToLocalStorage();
    // }
    sellersGrid(sellers);

    let users = JSON.parse(localStorage.getItem("users"));
    // if(!users){
    //     users = await usersToLocalStorage();
    // }
    usersGrid(users);
}

// currentType on add button
if (document.querySelector('#sellersGrid').classList.contains('active')) {
  currentType = 'sellers';
} else if (document.querySelector('#customersGrid').classList.contains('active')) {
  currentType = 'users';
} else {
  currentType = 'sellers'; 
}

//populate grids + hide row
function sellersGrid(sellers){
let sellersBody = document.getElementById("sellersBody");
sellersBody. innerHTML="";
sellers.forEach((seller, i) => {              
    sellersBody.innerHTML += `
      <div id="sellersRow${i}" class="row border-bottom py-1">
        <div class="col-3 d-flex flex-lg-row flex-column">
        <span class=" first rounded-circle text-white d-flex justify-content-center align-items-center me-2 p-2" style="width:3rem; height:3rem; font-size:1em;">
         ${seller.name.substring(0,2)}</span>
         <div>
        <strong>${seller.name}</strong><br><small>${seller.email}</small></div></div>
         <div class="col-md-2 col">${seller.name}</div>
        <div class="col-md-2 col">${seller.phone}</div>
        <div class="col-md-2 col">${seller.address.street},<br> ${seller.address.city},<br> ${seller.address.country}</div>

               
       
        <div class="col">
       <i id="sellersEye${i}" class="fa fa-eye text-primary border border-primary p-1 mb-1" onclick="toggleRow(${i}, 'sellers')"  aria-hidden="true" style="cursor:pointer;"></i><br>
       <i class="fa-solid fa-pen-to-square border border-secondary p-1 mb-1 " onclick="openEditModal('sellers', ${i})" style="cursor:pointer;"></i><br>
      <i class="fa-solid fa-trash-can text-danger border border-danger p-1" onclick="deleteSeller(${i})" style="cursor:pointer;"></i>
        </div>
      </div>

      <div class="row border-bottom py-1 align-items-center" id="sellersPlaceholder${i}" style="display:none;">
  <div class="col text-muted">
    <i>Row hidden</i>
  </div>
  <div class="col-auto">
    <i class="fa fa-eye-slash text-primary border border-primary p-1" onclick="toggleRow(${i}, 'sellers')" aria-hidden="true" style="cursor:pointer;"></i>
  </div>
</div>
    `;
  });
 }



function usersGrid(users){
let usersBody = document.getElementById("customersBody");
usersBody.innerHTML="";
users.forEach((user, i) => {                              
    usersBody.innerHTML += `
      <div  class="row border-bottom py-1" id="usersRow${i}">
        <div class="col-3 d-flex flex-lg-row flex-column ">
        <span class=" first rounded-circle text-white d-flex justify-content-center align-items-center me-2 p-2" style="width:3rem; height:3rem; font-size:1em;">
         ${user.name.substring(0,2)}</span>
         <div>
        <strong>${user.name}</strong><br><small>${user.email}</small></div></div>
        <div class="col-md-2 col">${user.phone}</div>
        <div class="col-md-2 col">${user.addresses.length}<br> Addresses</div> 
       
        <div class="col">${user.createdAt}</div>
        <div class="col">
      <i id="usersEye${i}" class="fa fa-eye text-primary border border-primary p-1  mb-1" onclick="toggleRow(${i}, 'users')"  aria-hidden="true" style="cursor:pointer;"></i><br>
       <i class="fa-solid fa-pen-to-square border border-secondary p-1 mb-1 " onclick="openEditModal('users', ${i})" style="cursor:pointer;"></i><br>
     <i class="fa-solid fa-trash-can text-danger border border-danger p-1" onclick="deleteUser(${i})" style="cursor:pointer;"></i>
        </div>
      </div>

  <div class="row border-bottom py-1 align-items-center" id="usersPlaceholder${i}" style="display:none;">
  <div class="col text-muted">
    <i>Row hidden</i>
  </div>
  <div class="col-auto ">
    <i class="fa fa-eye-slash text-primary border border-primary p-1" onclick="toggleRow(${i}, 'users')" aria-hidden="true" style="cursor:pointer;"></i>
  </div>
</div>
    `;
  });
 }
//delete
function deleteSeller(i) {
  if (confirm("Are you sure you want to delete this seller?")) {
    let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
    sellers.splice(i, 1);
    localStorage.setItem("sellers", JSON.stringify(sellers));
    sellersGrid(sellers);
  }
}

function deleteUser(i) {
  if (confirm("Are you sure you want to delete this user?")) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.splice(i, 1);
    localStorage.setItem("users", JSON.stringify(users));
    usersGrid(users);
  }
}

All();

//hide
function toggleRow(index, type) {
  let row = document.querySelector(`#${type}Row${index}`);
   let placeholderRow = document.getElementById(`${type}Placeholder${index}`);

  if (row.style.display === "none") {
    row.style.display = "flex";
   placeholderRow.style.display = "none";
  } else {
    row.style.display = "none"; 
   placeholderRow.style.display = "flex";
  }
}

//search by name
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keypress", (e) => {
 if (e.key === "Enter") {
let query = searchInput.value.toLowerCase();
let messageDiv = document.getElementById("messageDiv");

  if (!query) {
    // if input is empty, reload all
    All();                               
    messageDiv.innerHTML = "";
    return;
  }

  // which tab is active
  let activeTab = document.querySelector(".tab-pane.active").id;
   let filtered = [];

  if (activeTab === "sellersGrid") {
    let sellers = JSON.parse(localStorage.getItem("sellers")) || [];
    filtered = sellers.filter(s => s.name.toLowerCase().includes(query));
    sellersGrid(filtered);
  } else if (activeTab === "customersGrid") {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    filtered = users.filter(u => u.name.toLowerCase().includes(query));
    usersGrid(filtered);
  }
   if (filtered.length === 0) {
      messageDiv.innerHTML = '<p style="color:red; margin-top:0.5rem;">This name does not exist</p>';
    } else {
      messageDiv.innerHTML = ""; 
    }
  }
});




//populating the model in Add and Edit modes
let editType = ""; //users or sellers
let editIndex = null;
//if it's AddModal
function openAddModal(type){   
  editIndex = null;             
  currentType = type;

  //clear form
  document.getElementById("Name").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("Phone").value = "";
  document.getElementById("Street").value = "";
  document.getElementById("City").value = "";
  document.getElementById("Country").value = "";
  document.getElementById("Zip").value = "";
  //document.getElementById("Status").value = "";
  document.getElementById("addressesContainer").innerHTML = "";

  // edit to add , AND type is fetched from here by text content
  document.querySelector(".addToEdit").textContent = "Add ";
  document.querySelector(".sellerToCustomer").textContent = 
    type === "sellers" ? "Seller" : "Customer";

  new bootstrap.Modal(document.getElementById("editAddModal")).show();
  };


//if it's editModal
function openEditModal(type, i) {
  editIndex = i;        
  currentType = type;

  let list = JSON.parse(localStorage.getItem(type)) || [];
  let item = list[i];

  // placeholder with values
  document.getElementById("Name").value = item.name;
  document.getElementById("Email").value = item.email;
  document.getElementById("Phone").value = item.phone;
  //document.getElementById("Status").value = item.status;
   if (type === "sellers") {
  document.getElementById("Street").value = item.address.street || "";
  document.getElementById("City").value = item.address.city || "";
  document.getElementById("Country").value = item.address.country;
  document.getElementById("Zip").value = item.address.zipCode ||  "";
   } else { // users
    let allAddresses = item.addresses || [];
    let addresses = allAddresses[0] || {};
    document.getElementById("Street").value = addresses.street || "";
    document.getElementById("City").value = addresses.city || "";
    document.getElementById("Country").value = addresses.country || "";
    document.getElementById("Zip").value = addresses.zip || "";


let container = document.getElementById("addressesContainer");
  container.innerHTML = ""; 

  if (allAddresses.length > 1) {
    // start from the second address
    for (let j = 1; j < allAddresses.length; j++) {
      let addr = allAddresses[j];

      // row
      let row = document.createElement("div");
      row.className = "row g-3 mb-2";

      // street
      let streetDiv = document.createElement("div");
      streetDiv.className = "col-md-6";
      streetDiv.innerHTML = `
        <label class="form-label">Street</label>
        <input type="text" class="form-control extra-street" value="${addr.street || ""}">
      `;
      row.appendChild(streetDiv);

      // city
      let cityDiv = document.createElement("div");
      cityDiv.className = "col-md-3";
      cityDiv.innerHTML = `
        <label class="form-label">City</label>
        <input type="text" class="form-control extra-city" value="${addr.city || ""}">
      `;
      row.appendChild(cityDiv);

      // zip
      let zipDiv = document.createElement("div");
      zipDiv.className = "col-md-3";
      zipDiv.innerHTML = `
        <label class="form-label">Zip</label>
        <input type="text" class="form-control extra-zip" value="${addr.zip || ""}">
      `;
      row.appendChild(zipDiv);

      // country
      let countryDiv = document.createElement("div");
      countryDiv.className = "col-md-6";
      countryDiv.innerHTML = `
        <label class="form-label">Country</label>
        <input type="text" class="form-control extra-country" value="${addr.country || ""}">
      `;
      row.appendChild(countryDiv);

      container.appendChild(row);
    }
  }
  };
  
  // add to edit
  document.querySelector(".addToEdit").textContent = "Edit ";
  document.querySelector(".sellerToCustomer").textContent = 
    type === "sellers" ? "Seller" : "Customer";

  new bootstrap.Modal(document.getElementById("editAddModal")).show();
};


//save btn
document.querySelector("#editAddModal form").addEventListener("submit", function(e) {
 e.preventDefault();   //validation
  if (!this.checkValidity()) {
    e.stopPropagation();
    this.classList.add("was-validated");
    return; 
  }


  let name = document.getElementById("Name").value;
  let email = document.getElementById("Email").value;
  let phone = document.getElementById("Phone").value;
//  let status = document.getElementById("Status").value;
  let street = document.getElementById("Street").value;
  let city = document.getElementById("City").value;
  let country = document.getElementById("Country").value;
  let zip = document.getElementById("Zip").value;

  let list = JSON.parse(localStorage.getItem(currentType)) || [];

  if (editIndex === null) {
    // add
    if (currentType === "sellers") {
      list.push({ name, email, phone, address: { street, city, country, zipCode: zip } });
    } else {
    let today = new Date();
    let formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    list.push({ name, email, phone,createdAt: formattedDate, addresses: [{ street, city, country, zip }] });
    }
  } else {
    // edit
    if (currentType === "sellers") {
      list[editIndex].name = name;
      list[editIndex].email = email;
      list[editIndex].phone = phone;
      //list[editIndex].status = status;
      list[editIndex].address = { street, city, country, zipCode: zip };
    } else {
      list[editIndex].name = name;
      list[editIndex].email = email;
      list[editIndex].phone = phone;
      list[editIndex].status = status;
      
    if (!list[editIndex].addresses) list[editIndex].addresses = []; 
    if (list[editIndex].addresses.length === 0) {
      list[editIndex].addresses.push({ street, city, country, zip });
    } else {
        list[editIndex].addresses[0] = { ...list[editIndex].addresses[0], street, city, country, zip };//spread operator
    }
    }
  }

  localStorage.setItem(currentType, JSON.stringify(list));

  // refresh grids
  if (currentType === "sellers") sellersGrid(list);
  else usersGrid(list);

  
  let modal = bootstrap.Modal.getInstance(document.getElementById("editAddModal"));  
  modal.hide();
});

// Add this code to the end of your Script.js file

document.getElementById('sign-out-btn').addEventListener('click', function(e) {
    // Prevents the default behavior of the button/link
    e.preventDefault(); 
    
    // Optional: for debugging purposes
    console.log('Logging out...');  

    // Remove the admin's data from local storage
    localStorage.removeItem('current_admin'); 

    // Redirect the user to the home page
    window.location.href = '/home.html'; 
});


