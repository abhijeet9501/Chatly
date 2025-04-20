let privateSocket = null;
let privateName = null;
let currentFriend = null;



function setPrivateSocket(socket) {
  privateSocket = socket;
}

function setCurrentUsername(username) {
  privateName = username;
}

function appendMessage(text, user, type) {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;

  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = user
    ? user === privateName
      ? `You: ${text}`
      : `@${user}: ${text}`
    : text;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function initPrivateChat(friendUsername) {

  if (!privateSocket || !friendUsername) return alert("user is offline or username incorrect.");

  const chatConsole = document.getElementById("chatConsole");
  const chatTitle = document.getElementById("chatTitle");
  const nextButton = document.getElementById("nextButton");
  const chatMessages = document.getElementById("chatMessages");

  if (!chatConsole || !chatTitle || !nextButton || !chatMessages) return;

  currentFriend = friendUsername;
  document.getElementById("heroContent").style.display = "none";
  chatConsole.style.display = "flex";
  chatMessages.innerHTML = "";
  nextButton.style.display = "none";
  chatTitle.textContent = `Waiting for ${friendUsername}`;

  appendMessage(`⏳ Waiting for ${friendUsername} to accept your chat request...`, null, "incoming");

  privateSocket.emit("request-friend", friendUsername);
}


function handlePrivateEvents() {
  if (!privateSocket) return;

  privateSocket.onAny((event, data) => {
  });

  privateSocket.on("connect", () => {
  });

  privateSocket.on("privateName", (data) => {
    privateName = data.name;
  });

  privateSocket.on("private:user-offline", ({ username }) => {
    resetChatUI();
    appendMessage(`❌ @${username} is offline or not found.`, null, "incoming");
  });

  privateSocket.on("private:request-connection", ({ from }) => {
    const notification = document.createElement("div");
    notification.className = "notification";
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#1a1a1a",
      padding: "15px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      zIndex: "1000",
    });

    const message = document.createElement("p");
    message.textContent = `@${from} wants to chat!`;
    notification.appendChild(message);

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Join";
    acceptBtn.onclick = () => {
      privateSocket.emit("confirm-connection", from);
      openChatConsole(from);
      currentChatType = "friend";
      notification.remove();
    };

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject";
    rejectBtn.onclick = () => {
      privateSocket.emit("reject-connection", from);
      notification.remove();
    };

    notification.appendChild(acceptBtn);
    notification.appendChild(rejectBtn);
    document.body.appendChild(notification);
  });

  privateSocket.on("private:user-rejected-request", () => {
    resetChatUI();
    appendMessage("❌ Your friend rejected the chat request.", null, "incoming");
  });

  privateSocket.on("private:user-joined", ({ username }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    openChatConsole(username);
    appendMessage(`✅ @${username} joined the chat.`, null, "incoming");
  });

  privateSocket.on("private:user-left", ({ username }) => {
    appendMessage(`🚪 @${username} left the chat.`, null, "incoming");
  });

  privateSocket.on("private:previous-messages", (messages) => {
    const chatConsole = document.getElementById("chatConsole");
    const chatMessages = document.getElementById("chatMessages");

    if (!chatConsole || !chatMessages) return;

    chatConsole.style.display = "flex";
    chatMessages.innerHTML = "";

    messages.forEach((msg) => {
      appendMessage(msg.message, msg.user, msg.user === privateName ? "user" : "incoming");
    });
  });

  privateSocket.on("private:new-message", ({ user, message }) => {
    if (user !== privateName) {
      appendMessage(message, user, "incoming");
    }
  });

  privateSocket.on("disconnect", () => {
    appendMessage("🔌 Disconnected from private chat.", null, "incoming");
  });
}

function openChatConsole(friendUsername) {
  const chatConsole = document.getElementById("chatConsole");
  const chatTitle = document.getElementById("chatTitle");
  const heroContent = document.getElementById("heroContent");

  if (!chatConsole || !chatTitle || !heroContent) return;

  currentFriend = friendUsername;
  chatTitle.textContent = `Chat with @${friendUsername}`;
  chatConsole.style.display = "flex";
  heroContent.style.display = "none";
}

function sendPrivateMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !privateSocket) return;

  privateSocket.emit("private-message", text);
  appendMessage(text, privateName, "user");
  input.value = "";
}

function closePrivateChat() {
  if (privateSocket) {
    privateSocket.emit("leave-chat");
  }
  resetChatUI();
}

function resetChatUI() {
  const chatConsole = document.getElementById("chatConsole");
  const heroContent = document.getElementById("heroContent");
  const chatMessages = document.getElementById("chatMessages");
  const messageInput = document.getElementById("messageInput");

  if (chatConsole) chatConsole.style.display = "none";
  if (heroContent) heroContent.style.display = "block";
  if (chatMessages) chatMessages.innerHTML = "";
  if (messageInput) messageInput.value = "";
}

