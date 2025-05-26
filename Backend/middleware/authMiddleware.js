import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ Middleware to protect routes and extract user from JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-clearancePassword');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ✅ Role-based access control middleware
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
  }
  next();
};

// ✅ Named exports
const verifyToken = authenticateUser;        // Alias for compatibility
const verifyAdmin = authorizeRoles('admin'); // For admin-only routes

export {
  authenticateUser,
  authorizeRoles,
  verifyToken,
  verifyAdmin
};
