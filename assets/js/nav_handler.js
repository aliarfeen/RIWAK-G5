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
