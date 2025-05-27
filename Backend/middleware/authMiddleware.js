import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired, please login again' });
      }
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-clearancePassword');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Server error during authentication' });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
  }
  next();
};

const verifyToken = authenticateUser;
const verifyAdmin = authorizeRoles('admin'); 

export {
  authenticateUser,
  authorizeRoles,
  verifyToken,
  verifyAdmin
};
