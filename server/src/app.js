import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { MY_IP } from './config/envConfig.js'
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import nodemailer from 'nodemailer'
import doctorRoutes from './routes/doctorRoutes.js'

const app = express();
const allowedOrigins = [
    `http://${MY_IP}:5173`,
    'http://localhost:5173',];
const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log("data is : ",req.body)
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, 
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  });
app.use('/uploads', uploadRoutes);
app.use('/auth', authRoutes);
app.use('/doctor',doctorRoutes)
app.use('/patient',patientRoutes)

export default app