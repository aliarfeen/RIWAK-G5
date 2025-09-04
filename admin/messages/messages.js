document.addEventListener("DOMContentLoaded", () => {
  const messagesList = document.getElementById("messagesList");

  let messages = JSON.parse(localStorage.getItem("contact_messages")) || [];

  if (messages.length === 0) {
    messagesList.innerHTML = "<p>No messages received yet.</p>";
    return;
  }

  messages.forEach((msg, index) => {
    const card = document.createElement("div");
    card.className = "message_card";

    card.innerHTML = `
      <div class="message_header">
        <h3>${msg.name} (${msg.phone})</h3>
        <span>${msg.createdAt}</span>
      </div>
      <div class="message_body">
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
      </div>
    `;

    messagesList.appendChild(card);
  });
});



document.getElementById('sign-out-btn').addEventListener('click', function(e) { e.preventDefault(); console.log('Logging out...');  
                localStorage.removeItem('current_admin'); 

            window.location.href = '/home.html'; });

