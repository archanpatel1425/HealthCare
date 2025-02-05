import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import app from './app.js';
import { PORT } from './config/envConfig.js';
import { initializeSocket } from './config/socketConfig.js';
dotenv.config();

const prisma = new PrismaClient();
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    initializeSocket(app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer()