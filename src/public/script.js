const SERVER_URL = "";
let isLoggedIn = false;

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();
    if (data.user) {
      showUserProfile(data.user);
      isLoggedIn = true;

      // Initialize private chat socket
      const privateSocket = io(`${SERVER_URL}/private`, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      setPrivateSocket(privateSocket);
      setCurrentUsername(data.user.username);
      handlePrivateEvents();
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
  }
});

function showUserProfile(user) {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.style.display = "none";

  const userProfile = document.getElementById("userProfile");
  if (userProfile) userProfile.style.display = "flex";

  document.getElementById("dropdownName").textContent = user.name || "Name";
  document.getElementById("dropdownEmail").textContent = user.email || "Email";
  document.getElementById("dropdownUsername").textContent = `@${user.username || "username"}`;

  userProfile.addEventListener("click", () => {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
  });

  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("userDropdown");
    if (!document.getElementById("userProfile").contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

function logout() {
  document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  location.reload();
}

function openAccountSettings() {
  alert("Account settings page coming soon!");
}


let currentChatType = null;

function loadChat(type) {
  const heroContent = document.getElementById("heroContent");
  const namePrompt = document.getElementById("namePrompt");
  const chatConsole = document.getElementById("chatConsole");
  const nextButton = document.getElementById("nextButton");

  currentChatType = type;
  document.getElementById("chatMessages").innerHTML = "";
  document.getElementById("messageInput").value = "";

  
  heroContent.style.display = "none";
  chatConsole.style.display = "none";
  namePrompt.style.display = "none";
  nextButton.style.display = "none";

  if (type === "global") {
    const existingToken = getCookie("anonToken");
    if (existingToken) {
      chatConsole.style.display = "flex";
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initGlobalChat(); 
    } else {
      namePrompt.style.display = "block";
    }
  } else if (type === "random") {
    if (!isLoggedIn) {
      heroContent.style.display = "block";
      alert("Please login first!");
      return;
    }
    chatConsole.style.display = "flex";
    nextButton.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initRandomChat();
  } else if (type === "friend") {
    if (!isLoggedIn) {
      heroContent.style.display = "block";
      alert("Please login first!");
      return;
    }
    const friendUsername = document.getElementById("friendUsername").value.trim();
    document.getElementById("friendUsername").value = "";
    if (!friendUsername) {
      alert("Please enter a friend's username.");
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initPrivateChat(friendUsername);
  }
}

function enterGlobalChat() {
  if (isLoggedIn) {
    initGlobalChat();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const nameInput = document.getElementById("globalNameInput").value.trim();
  if (!nameInput) {
    alert("Please enter a name.");
    return;
  }
  document.getElementById("namePrompt").style.display = "none";
  initGlobalChat(nameInput);
}

function sendMessage() {
  if (currentChatType === "global") {
    sendGlobalMessage();
  } else if (currentChatType === "random") {
    sendRandomMessage();
  } else if (currentChatType === "friend") {
    sendPrivateMessage();
  }
}

function closeChat() {
  if (currentChatType === "friend") {
    closePrivateChat();
  }
  else if (currentChatType == "global"){
      closeGlobalChat();
  }
  else if (currentChatType == "random"){
      closeRandomChat();
  }
  currentChatType = null;
}

function nextUser() {
  if (currentChatType === "random") {
    nextUser();
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}


