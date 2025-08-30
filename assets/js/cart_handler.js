const cart = localStorage.getItem("cart");
const currentUser = localStorage.getItem("current_user");

const checkOutBtn = document.getElementById("submiting");

checkOutBtn.addEventListener("click", function (e) {
    if (!cart || JSON.parse(cart).length === 0) {
        e.preventDefault();

        const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
        emptyCartModal.show();
    }else if(!currentUser){
        e.preventDefault();
        const logInRequiredModal = new bootstrap.Modal(document.getElementById('logInRequiredModal'));
        logInRequiredModal.show();
    }
});
