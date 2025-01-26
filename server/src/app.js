import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import authRoutes from './routes/authRoutes.js'

dotenv.config();
const app = express();
const MYIP = process.env.MY_IP;

const allowedOrigins = [
    `http://${MYIP}:5173`,
    'http://localhost:5173',
];

const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

export default app