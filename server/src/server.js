import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import app from './app.js';
import { PORT } from './config/envConfig.js';
import { initializeChatSocket, initializeMeetSocket } from './config/socketConfig.js';

dotenv.config();

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    // Start the server and get the instance
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Initialize both sockets with the same server instance
    initializeChatSocket(server);
    initializeMeetSocket(server);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
