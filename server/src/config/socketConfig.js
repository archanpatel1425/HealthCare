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

export const initializeMeetSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Authorization"]
        },
        path: "/meet-socket/",
        transports: ["websocket", "polling"]
    });

    const activeUsers = new Map();
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

        socket.on('disconnect', () => {
            activeUsers.delete(socket.user.id);
            io.emit('activeUsers', Array.from(activeUsers.keys()));
        });
    });
};

export const initializeChatSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Authorization"]
        },
        path: "/chat-socket/",
        transports: ["websocket", "polling"]
    });

    const activeUsers = new Map();

    io.use(verifySocketToken);

    io.on("connection", (socket) => {

        activeUsers.set(socket.user.id, socket.id);
        io.emit('activeUsers', Array.from(activeUsers.keys()));
        io.emit('userConnected',socket.user.id)
        socket.on('sendMessage', async (data) => {
            try {
                const { receiverId, messageType, message } = data;
                let receiverType = socket.user.usertype === "DOCTOR" ? "PATIENT" : "DOCTOR";

                const initialStatus = activeUsers.has(receiverId) ? 'DELIVERED' : 'SENT';

                const chatMessage = await prisma.chat.create({
                    data: {
                        senderId: socket.user.id,
                        senderType: socket.user.usertype,
                        receiverId,
                        receiverType,
                        message,
                        messageType,
                        status: initialStatus
                    }
                });

                const receiverSocketId = activeUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', chatMessage);
                }

                socket.emit('messageSent', chatMessage);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });

        socket.on('fetchPreviousMessages', async ({ receiverId }) => {
            try {
                const messages = await prisma.chat.findMany({
                    where: {
                        OR: [
                            { senderId: socket.user.id, receiverId },
                            { senderId: receiverId, receiverId: socket.user.id }
                        ]
                    },
                    orderBy: { createdAt: 'asc' }
                });

                socket.emit('previousMessages', messages);

                // Mark unread messages as delivered
                const unreadMessages = messages.filter(
                    msg => msg.receiverId === socket.user.id && msg.status === 'SENT'
                );

                for (const msg of unreadMessages) {
                    await prisma.chat.update({
                        where: { id: msg.id },
                        data: { status: 'DELIVERED' }
                    });

                    const senderSocketId = activeUsers.get(msg.senderId);
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('messageStatusUpdated', {
                            messageId: msg.id,
                            status: 'DELIVERED'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        });

        socket.on('markAsDelivered', async (messageId) => {
            console.log("in delivered")
            try {
                const message = await prisma.chat.update({
                    where: { id: messageId },
                    data: { status: 'DELIVERED' }
                });

                const senderSocketId = activeUsers.get(message.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messageStatusUpdated', {
                        messageId,
                        status: 'DELIVERED'
                    });
                }
            } catch (error) {
                console.error('Error marking message as delivered:', error);
            }
        });

        socket.on('markAsRead', async (messageId) => {
            console.log("in read")
            try {
                const message = await prisma.chat.update({
                    where: { id: messageId },
                    data: { status: 'READ' }
                });

                const senderSocketId = activeUsers.get(message.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messageStatusUpdated', {
                        messageId,
                        status: 'READ'
                    });
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        socket.on('startTyping', ({ receiverId }) => {
            const receiverSocketId = activeUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('userTyping', {
                    userId: socket.user.id,
                    isTyping: true
                });
            }
        });

        socket.on('stopTyping', ({ receiverId }) => {
            const receiverSocketId = activeUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('userTyping', {
                    userId: socket.user.id,
                    isTyping: false
                });
            }
        });
        socket.on('disconnect', () => {
            activeUsers.delete(socket.user.id);
            io.emit('activeUsers', Array.from(activeUsers.keys()));
        });
    });
};