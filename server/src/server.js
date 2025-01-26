// import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        // await prisma.$connect();
        // console.log('Connected to database');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
