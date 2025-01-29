import { verifyAccessToken } from "../utils/tokenUtils";

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  
    if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }
    const isvalid=verifyAccessToken(token)
      if (isvalid) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      next();  
  };
  
