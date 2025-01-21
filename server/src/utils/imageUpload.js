const cloudinary = require('../config/cloudinaryConfig');

const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'user_uploads', // Optional: Specify a folder in Cloudinary
        });
        return result;
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

module.exports = uploadImage;