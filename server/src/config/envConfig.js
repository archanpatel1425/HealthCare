import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export environment variables
export const MY_IP = process.env.MY_IP;
export const PORT = process.env.PORT || 5000;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

