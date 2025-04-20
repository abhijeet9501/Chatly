let randomSocket;


function initRandomChat() {
  if (randomSocket) {
    return;
  }
    
  randomSocket = io(`${SERVER_URL}/random`); 

  document.getElementById("chatConsole").style.display = "flex";
  document.getElementById("chatTitle").textContent = "Random Stranger Chat";

  
  randomSocket.on("random:waiting", () => {
   appendPrivateMessage("🔄 Waiting for a stranger to join...", "incoming");
  });


  randomSocket.on("random:match-found", () => {
   appendPrivateMessage("✅ Matched with a stranger!", "incoming");
  });


  randomSocket.on("random:new-message", (data) => {
    if (data.user != randomSocket.id){
     appendPrivateMessage(`Stranger: ${data.message}`, "incoming");
    }
  });


  randomSocket.on("random:user-disconnected", (data) => {
   appendPrivateMessage(`❌ Stranger left the chat`, "incoming");
  });
}

function sendRandomMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

 appendPrivateMessage(`You: ${text}`, "user");
  randomSocket.emit("random-message", text);
  input.value = "";
}

function randomChatSkip() {
  document.getElementById("chatMessages").innerHTML = "";
  appendPrivateMessage("🔄 Searching for a new stranger...", "incoming");
  randomSocket.emit("random-skip");
}

function appendPrivateMessage(text, type) {
  const chatMessages = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function closeRandomChat() {
  if (randomSocket) {
    randomSocket.disconnect(); 
    randomSocket = null;
  }
  resetChatUI();
}