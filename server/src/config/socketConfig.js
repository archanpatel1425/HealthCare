import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
const prisma = new PrismaClient();

const verifySocketToken = (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ? socket.handshake.headers.cookie.split('=')[1]
      : null;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.log("in error : ", error)
    next(new Error('Authentication error: Invalid token'));
  }
};

export const initializeSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Authorization"]
    },
    transports: ["websocket", "polling"]
  });
  io.use(verifySocketToken);

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


    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId,messageType, message } = data;
        let receiverType;
        if (socket.user.usertype == "DOCTOR") {
          receiverType = "PATIENT"
        }
        else {
          receiverType = "DOCTOR"
        }
        const chatMessage = await prisma.chat.create({
          data: {
            senderId: socket.user.id,
            senderType: socket.user.usertype,
            receiverId,
            receiverType,
            message,
            messageType,
            status: 'SENT'
          }
        });
        io.emit('messageReceived', chatMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    socket.on('fetchPreviousMessages', async ({ receiverId }) => {
      try {
        const previousMessages = await prisma.chat.findMany({
          where: {
            OR: [
                      { 
                          senderId: socket.user.id, 
                          receiverId: receiverId 
                      },
                      { 
                          senderId: receiverId, 
                          receiverId: socket.user.id 
                      }
                  ]
              },
              orderBy: { createdAt: 'asc' }
          });
          
          socket.emit('previousMessages', previousMessages);
      } catch (error) {
          console.error('Error fetching previous messages:', error);
      }
  });

  socket.on('markAsDelivered', async (messageId) => {
      try {
          await prisma.chat.update({
              where: { id: messageId },
              data: { status: 'DELIVERED' }
          });
          
          io.emit('messageUpdated', { messageId, status: 'DELIVERED' });
      } catch (error) {
          console.error('Error updating message status:', error);
      }
  });

  socket.on('markAsRead', async (messageId) => {
      try {
          await prisma.chat.update({
              where: { id: messageId },
              data: { status: 'READ' }
          });
          
          io.emit('messageUpdated', { messageId, status: 'READ' });
      } catch (error) {
          console.error('Error updating message status:', error);
      }
  });

    socket.on('disconnect', () => {
      // console.log('User disconnected:', socket.id);
    });
  });
};