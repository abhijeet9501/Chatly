let globalSocket = null;
let myName = null;


function initGlobalChat(nameInput = null) {
  const existingToken = getCookie("anonToken");

  if (existingToken) {
    startGlobalSocket(existingToken);
  } else {
    if (!nameInput) {
      alert("Name is required to enter global chat.");
      return;
    }

 
    fetch(`${SERVER_URL}/api/v1/anonUser/anon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        startGlobalSocket(getCookie("anonToken"));
      })
      .catch((err) => {
        console.error("Error creating anon token:", err);
        alert("Failed to join chat. Try again.");
      });
  }
}

function startGlobalSocket(token) {
  if (globalSocket) {
    return; 
  }
  globalSocket = io(`${SERVER_URL}/global`, { 
    auth: {
      anonToken: token,
    },
    transports: ['websocket'], 
    secure: true, 
    withCredentials: true, 
  });
  

  globalSocket.on("myname", (name) => {
    myName = name.name;
  });


  document.getElementById("chatConsole").style.display = "flex";


  globalSocket.on("previousMessages", (messages) => {
    messages.forEach((msg) => {
      if (msg.anonUser === myName) {
        appendGlobalMessage(msg, "user");
      } else {
        appendGlobalMessage(msg, "incoming");
      }
    });
  });


  globalSocket.on("newGlobalMessage", (msg) => {
    if (msg.anonUser === myName) {
        appendGlobalMessage(msg, "user");
    } else {
      appendGlobalMessage(msg, "incoming");
    }
  });
}


function sendGlobalMessage() {
  const msgInput = document.getElementById("messageInput");
  const msg = msgInput.value.trim();
  if (msg && globalSocket) {
    globalSocket.emit("globalMessage", msg);
    msgInput.value = "";
  }
}


function appendGlobalMessage(text, type) {
  const chatMessages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `message ${type}`;
  if (text.anonUser !== myName) {
    div.textContent = `${text.anonUser}: ${text.message}`;
  } else {
    div.textContent = `You: ${text.message}`;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function closeGlobalChat() {
  if (globalSocket) {
    globalSocket.disconnect(); 
    globalSocket = null;
  }
  resetChatUI();
}