import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { MY_IP } from './config/envConfig.js'
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

import doctorRoutes from './routes/doctorRoutes.js'

const app = express();
const allowedOrigins = [
    `http://${MY_IP}:5173`,
    'http://localhost:5173',];;
const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', uploadRoutes);
app.use('/auth', authRoutes);
app.use('/doctor',doctorRoutes)
app.use('/patient',patientRoutes)

export default app