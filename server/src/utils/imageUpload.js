import cloudinary from '../config/cloudinary.js';

const uploadImage = async (filePath) => {
    try {
        console.log('uploading ......')
        const result = await cloudinary.uploader.upload(filePath, {
        });
        console.log(result)
        return result;
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

export default uploadImage;