
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form_container");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("sub").value.trim();
    const message = document.getElementById("message").value.trim();

    const contactData = {
      name,
      phone,
      subject,
      message,
      createdAt: new Date().toLocaleString(),
    };

    let messages = JSON.parse(localStorage.getItem("contact_messages")) || [];
    messages.push(contactData);
    localStorage.setItem("contact_messages", JSON.stringify(messages));

    const successBox = document.createElement("p");
    successBox.textContent = "✅ Message saved!";
    successBox.style.color = "green";
    successBox.style.marginTop = "10px";

    form.appendChild(successBox);

    form.reset();

    setTimeout(() => successBox.remove(), 3000); 
  });
});