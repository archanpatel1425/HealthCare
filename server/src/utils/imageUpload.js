import cloudinary from '../config/cloudinary.js';

const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
        });
        return result;
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

export default uploadImage;