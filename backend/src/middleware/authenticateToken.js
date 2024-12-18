// backend/middleware/authenticateToken.js
import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key'; // Store in environment variables for security

const authenticateToken = (req, res, next) => {
  
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
};

export default authenticateToken;
