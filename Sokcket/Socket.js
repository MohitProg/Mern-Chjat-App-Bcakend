import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const onlineUserSocketmap = {};
export const getReciverSocketId = (reciverId) => {
  return onlineUserSocketmap[reciverId.id];
};

//  method to connect with socket
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const userName = socket.handshake.query.userName;

  if (userName !== undefined) {
    //  this method send message to all except you
    socket.broadcast.emit("notification", `${userName} Join the WebChat`);
  }

  if (userId !== undefined) onlineUserSocketmap[userId] = socket.id;

  // io.emit( ) method to send message to all join member
  io.emit("getonlineuser", Object.keys(onlineUserSocketmap));
  //  socket.on(); method is used to listen user with data from one connection to other
  socket.on("disconnect", () => {
    delete onlineUserSocketmap[userId];
    io.emit("getonlineuser", Object.keys(onlineUserSocketmap));
  });
});

export { app, server, io };
