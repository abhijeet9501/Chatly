import Message from "../models/message.model.js";
import Room from "../models/room.model.js";
import { verifyAnon } from "../utils/anonUser.util.js";
import "dotenv/config";
import cookie from "cookie";

const roomId = process.env.GLOBAL_ROOM_ID;

const globalChatHandler = (io) => {
    const globalNamespace = io.of("/global");
    globalNamespace.on("connection", async (socket) => {
        socket.join(roomId);

        let anonUser = "Guest#1234";
        const cookies = socket.handshake.headers?.cookie;
       
        if (cookies) {
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies?.anonToken;
            
            if (token) {
                const decoded = verifyAnon(token);
                if (decoded && decoded.nameID) {
                    anonUser = decoded.nameID;
                }
            }
        }
        socket.emit("myname", { name: anonUser });

        let globalRoom = await Room.findOne({ roomId });
        if (!globalRoom) {
            globalRoom = await Room.create({ roomType: "global", roomId, name: "Global Chat Room" });
        }

        if (globalRoom) {
            const messages = await Message.find({ room: globalRoom._id })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
            socket.emit("previousMessages", messages.reverse());
        };

        socket.on("globalMessage", async (msgText) => {
            if (!msgText || msgText.trim() === "") return;
            const room = await Room.findOne({ roomId });

            const message = await Message.create({
                message: msgText,
                room: room._id,
                user: null,
                anonUser 
            });

            const finalmessage = {
                message: msgText,
                anonUser,
                createdAt: message.createdAt,
            };

            globalNamespace.to(roomId).emit("newGlobalMessage", finalmessage);
        });

    });
};

export default globalChatHandler;