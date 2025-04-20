import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/auth.util.js";
import cookie from "cookie";

const roomQueue = [];

export function fetchUserID(socket) {
    const cookies = socket.handshake.headers?.cookie;

    if (cookies) {
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies?.uid;

        if (token) {
            const decoded = verifyToken(token);
            if (decoded && decoded._id) {
                const userID = decoded._id;
                return userID;
            }
        }
    }
    return null;
}

async function handleRandomMatch(io, socket, userID) {
    const existingRoom = await Room.findOne({ users: userID, roomType: "random" });
    if (existingRoom) {
        await cleanRoom(io, socket, userID);
    }
    if (roomQueue.length === 0) {
        const newRoom = await Room.create({
            roomType: 'random',
            users: [userID],
        });

        socket.join(newRoom._id.toString());
        socket.data.randomRoomID = newRoom._id.toString();
        roomQueue.push(newRoom._id.toString());

        socket.emit("random:waiting");
    }
    else {
        const waitingRoomID = roomQueue.shift();
        const room = await Room.findById(waitingRoomID);

        if (!room) { // room not found
            return;
        }

        room.users.push(userID);
        await room.save();

        socket.join(waitingRoomID.toString());
        socket.data.randomRoomID = waitingRoomID.toString();

        io.to(waitingRoomID).emit("random:match-found", {
            waitingRoomID,
            users: room.users,
        });
    }
}

async function cleanRoom(io, socket, userID) {
    const room = await Room.findOne({ users: userID, roomType: "random" });
    if (room) {
        const username = await User.findById(userID);
        io.to(room._id.toString()).emit("random:user-disconnected", {
            user: username.name,
        });
        await Room.deleteOne({ _id: room._id });
        socket.leave(room._id.toString());
    }
    else if (socket.data?.randomRoomID) {
        socket.leave(socket.data.randomRoomID);
    }
}

const randomChatHandler = (io) => {
    const randomNamespace = io.of("/random");
    randomNamespace.on("connection", async (socket) => {
        const userID = fetchUserID(socket);

        if (!userID) {
            console.log("Not a valid userID");
            return;
        }

        await handleRandomMatch(randomNamespace, socket, userID);

        socket.on("random-message", async (msg) => {
            if (!msg || msg.trim() === "") return;
            const room = await Room.findOne({ users: userID, roomType: "random" });
            if (!room) return;
           
            const finalMessage = {
                message: msg,
                user: socket.id,
                createdAt: new Date(),
            };

            randomNamespace.to(room._id.toString()).emit("random:new-message", finalMessage);
        });

        socket.on("random-skip", async () => {
            await cleanRoom(randomNamespace, socket, userID);
            await handleRandomMatch(randomNamespace, socket, userID);
        });

        socket.on("disconnect", async () => {
            await cleanRoom(randomNamespace, socket, userID);
        });

    });
}

export default randomChatHandler;