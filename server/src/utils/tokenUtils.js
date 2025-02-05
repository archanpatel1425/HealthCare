import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()
export const generateAccessToken = (userId, userType) => {
  return jwt.sign({ id: userId, usertype: userType }, process.env.JWT_SECRET, { expiresIn: '50m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.usertype = decoded.usertype
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ success: false, message: 'Unauthorized: Inva lid token' });
  }
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
