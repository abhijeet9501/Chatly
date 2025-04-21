function handleKeyboard() {
    const chatConsole = document.getElementById('chatConsole');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
  
    // Adjust console height when viewport resizes (keyboard opens/closes)
    window.visualViewport.addEventListener('resize', () => {
      chatConsole.style.height = `${window.visualViewport.height}px`;
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
      messageInput.focus(); // Keep input focused
    });
  
    // Scroll to bottom when input is focused
    messageInput.addEventListener('focus', () => {
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 300); // Delay for keyboard animation
    });
  
    // Reset height when keyboard is dismissed
    messageInput.addEventListener('blur', () => {
      chatConsole.style.height = window.innerWidth <= 768 ? '80vh' : '75vh';
    });
  }
  
  // Initialize keyboard handling when chat console is opened
  function initializeChatConsole() {
    const chatConsole = document.getElementById('chatConsole');
    if (chatConsole.style.display !== 'none') {
      handleKeyboard();
    }
  }
  