import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";
import { fetchUserID } from "./random.chat.socket.js";

function generateRoomId(userId1, userId2) {
  return [userId1.toString(), userId2.toString()].sort().join("_");
}

function findSocketByUsername(io, username) {
  for (const [id, socket] of io.of("/private").sockets) {
    if (socket.data.username === username) {
      return socket;
    }
  }
  return null;
}

const privateChatHandler = (io) => {
  const privateNamespace = io.of("/private");

  privateNamespace.on("connection", async (socket) => {
    const userID = fetchUserID(socket);
    if (!userID) {
      return;
    }

    const user = await User.findById(userID);
    if (!user) {
      return;
    }

    socket.data.userId = user._id;
    socket.data.username = user.username;
    socket.emit("myname", { name: user.username });

    socket.on("request-friend", async (username) => {
      const friendSocket = findSocketByUsername(io, username);
      if (!friendSocket) {
        socket.emit("private:user-offline", { username });
        return;
      }

      socket.data.friendUsername = username;
      friendSocket.data.friendUsername = socket.data.username;
      friendSocket.emit("private:request-connection", {
        from: socket.data.username,
      });
    });

    socket.on("confirm-connection", async () => {
      const myUserId = socket.data.userId;
      const friendUsername = socket.data.friendUsername;
  
      if (!friendUsername) {
        return;
      }

      const friendUser = await User.findOne({ username: friendUsername });
      if (!friendUser) {
        return;
      }

      const [userA, userB] = [myUserId, friendUser._id].sort();
      const roomId = generateRoomId(userA, userB);

      let room = await Room.findOne({ roomId, roomType: "private" });
      if (!room) {
        room = await Room.create({
          roomType: "private",
          roomId,
          users: [userA, userB],
        });
        // await Friend.create({
        //   user: userA,
        //   friend: userB,
        //   room: room._id,
        // });
      }

      socket.join(room.roomId);
      socket.data.roomId = room.roomId; 
      const friendSocket = findSocketByUsername(io, friendUser.username);
      if (friendSocket) {
        friendSocket.join(room.roomId);
        friendSocket.data.roomId = room.roomId;
        const socketsInRoom = await privateNamespace.in(room.roomId).fetchSockets();
        socketsInRoom.forEach((s) => {
          const other = socketsInRoom.find((x) => x.id !== s.id);
          const otherUsername = other?.data.username || "Unknown";
          s.emit("private:user-joined", {
            username: otherUsername,
          });
        });
      }

      const messages = await Message.find({ room: room._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      privateNamespace.to(room.roomId).emit("private:previous-messages", messages.reverse());
    });

    socket.on("reject-connection", () => {
      const friendSocket = findSocketByUsername(io, socket.data.friendUsername);
      if (friendSocket) {
        friendSocket.emit("private:user-rejected-request");
      }
    });

    socket.on("private-message", async (msg) => {
      if (!msg || msg.trim() === "") return;

      const myUserId = socket.data.userId;
      const friendUsername = socket.data.friendUsername;
      if (!friendUsername) {
        return;
      }

      const friendUser = await User.findOne({ username: friendUsername });
      if (!friendUser) {
        return;
      }

      const [userA, userB] = [myUserId, friendUser._id].sort();
      const roomId = generateRoomId(userA, userB);
      const room = await Room.findOne({ roomId, roomType: "private" });
      if (!room) {
        return;
      }

      const message = await Message.create({
        user: socket.data.username,
        message: msg,
        room: room._id,
      });

      privateNamespace.to(room.roomId).emit("private:new-message", {
        message: msg,
        user: socket.data.username,
        createdAt: new Date(),
      });
    });

    socket.on("leave-chat", () => {
      if (socket.data.roomId) {
        privateNamespace.to(socket.data.roomId).emit("private:user-left", {
          username: socket.data.username,
        });
        socket.leave(socket.data.roomId);
        delete socket.data.roomId;
      }
    });

    socket.on("disconnect", () => {
      if (socket.data.roomId) {
        privateNamespace.to(socket.data.roomId).emit("private:user-left", {
          username: socket.data.username,
        });
        socket.leave(socket.data.roomId);
      }
    });
  });
};

export default privateChatHandler;