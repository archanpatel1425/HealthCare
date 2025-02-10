import express from 'express';
import fs from 'fs';
import multer from 'multer';
import uploadImage from '../utils/imageUpload.js';

const router = express.Router();
const upload = multer({
    dest: 'utils/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const result = await uploadImage(req.file.path);
        // Delete the local file after uploading to Cloudinary
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: 'Image uploaded successfully',
            url: result.secure_url
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;