function initUserUI() {
  const currentUser = localStorage.getItem("current_user");
  const userData = currentUser ? JSON.parse(currentUser) : null;

  const welcomeUser = document.getElementById("welcome-user");
  const noCurrentUser = document.getElementById("no-current-user");
  const currentUserLink = document.getElementById("current-user");

  if (userData && welcomeUser) {
    welcomeUser.innerText = userData.name;
    noCurrentUser?.classList.add("d-none");
    currentUserLink?.classList.remove("d-none");
  }else{
    
    noCurrentUser?.classList.remove("d-none");
    currentUserLink?.classList.add("d-none");

  }
}

// check every 200ms until header is loaded
const checkHeader = setInterval(() => {
  if (document.getElementById("welcome-user")) {
    clearInterval(checkHeader);
    initUserUI();
  }
}, 200);

   // Function to load HTML and insert into a target position
    function loadHTML(file, position, callback) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      if (position === "start") {
        document.body.insertAdjacentHTML("afterbegin", data);
      } else if (position === "end") {
        document.body.insertAdjacentHTML("beforeend", data);
      }

      if (typeof callback === "function") {
        callback(); // Run extra logic after HTML is injected
      }
    })
    .catch(error => console.error("Error loading file:", error));
}
// Append header at the beginning
loadHTML("nav.html", "start", initHeaderEvents);

// Append footer at the end
loadHTML("footer.html", "end", initFooterEvents);

function initHeaderEvents() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const topBar = document.querySelector('.top-bar');
  const closeTopBarBtn = document.querySelector('.close-top-bar');

  if (closeTopBarBtn && topBar) {
    closeTopBarBtn.addEventListener('click', function() {
      topBar.style.display = 'none';
    });
  }
}

function initFooterEvents() {
  // Add footer-specific JS here later if needed
}
