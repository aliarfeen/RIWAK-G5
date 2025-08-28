   // Function to load HTML and insert into a target position
    function loadHTML(file, position) {
      fetch(file)
        .then(response => response.text())
        .then(data => {
          if (position === "start") {
            document.body.insertAdjacentHTML("afterbegin", data);
          } else if (position === "end") {
            document.body.insertAdjacentHTML("beforeend", data);
          }
        })
        .catch(error => console.error("Error loading file:", error));
    }

    // Append header at the beginning
    loadHTML("nav.html", "start");

    // Append nav at the end
    loadHTML("footer.html", "end");
   document.addEventListener('DOMContentLoaded', function() {

            const mainNav = document.querySelector('.main-nav');

       

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

        });