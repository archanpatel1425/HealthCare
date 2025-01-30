import { Server as SocketIOServer } from 'socket.io';

export const initializeSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (meetId) => {
      socket.join(meetId);
      console.log("User joined room:", meetId);
      socket.to(meetId).emit("user-connected", socket.id);
    });

    socket.on("send-offer", ({ meetId, offer }) => {
      console.log("Broadcasting offer to room:", meetId);
      socket.to(meetId).emit("receive-offer", { offer, senderId: socket.id });
    });

    socket.on("send-answer", ({ meetId, answer, senderId }) => {
      console.log("Sending answer to:", senderId);
      io.to(senderId).emit("receive-answer", { answer });
    });

    socket.on("send-ice-candidate", ({ meetId, candidate }) => {
      console.log("Broadcasting ICE candidate to room:", meetId);
      socket.to(meetId).emit("receive-ice-candidate", { candidate });
    });

    socket.on("leave-room", (meetId) => {
      socket.leave(meetId);
      console.log("User left room:", meetId);
      socket.to(meetId).emit("user-disconnected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
