import { Server as SocketIOServer } from 'socket.io';

export const initializeSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("join-room", (meetId) => {
      socket.join(meetId);
      socket.to(meetId).emit("user-connected", socket.id);
    });

    socket.on("send-offer", ({ meetId, offer }) => {
      socket.to(meetId).emit("receive-offer", { offer, senderId: socket.id });
    });

    socket.on("send-answer", ({ meetId, answer, senderId }) => {
      io.to(senderId).emit("receive-answer", { answer });
    });

    socket.on("send-ice-candidate", ({ meetId, candidate }) => {
      socket.to(meetId).emit("receive-ice-candidate", { candidate });
    });

    socket.on("leave-room", (meetId) => {
      socket.leave(meetId);
      socket.to(meetId).emit("user-disconnected", socket.id);
    });
  });
};