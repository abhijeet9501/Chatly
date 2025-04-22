# Chatly

**Chatly** is a real-time chat web app built with Socket.io and Express.js. It lets users communicate in different ways — globally, privately, or with strangers — all in a simple, modern interface.

## Features

### 1. **Global Chat**
- Join an anonymous chat room with all online users.
- No account required.
- Messages are broadcasted to everyone in real-time.

### 2. **Private Chat**
- Enter another user’s username to send a private chat request.
- If the user is online, a request is sent.
- Once accepted, a private room is created for one-on-one messaging.
- Real-time updates with “waiting for user” and accepted states.

### 3. **Stranger Chat**
- Get randomly paired with another anonymous user.
- Chat in real-time without revealing identity unless you choose to.
- Great for fun, spontaneous conversations.

## Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- Hosted on Netlify  
  [Live App](https://chatly-production-d2c0.up.railway.app/)

**Backend**
- Node.js, Express.js
- Socket.io for real-time communication

