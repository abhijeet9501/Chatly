import "dotenv/config";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";

import http from "http";
import { Server } from "socket.io";
import globalChatHandler from "./src/socket/globalChat.socket.js";
import randomChatHandler from "./src/socket/random.chat.socket.js";
import privateChatHandler from "./src/socket/privateChat.socket.js";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        credentials: true,
    },
});



const startServer = async () => {
    await connectDB();
    globalChatHandler(io);
    randomChatHandler(io);
    privateChatHandler(io);
    
    server.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
}

startServer();