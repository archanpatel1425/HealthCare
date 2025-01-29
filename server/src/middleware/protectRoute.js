import { verifyAccessToken } from "../utils/tokenUtils";

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  
    if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }
    const isvalid=verifyAccessToken(token)
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (isvalid) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      next();  
    });
  };
  
