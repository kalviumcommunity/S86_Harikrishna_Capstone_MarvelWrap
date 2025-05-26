import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /signup - Register new user or admin (admin requires secret key)
router.post('/signup', async (req, res) => {
  try {
    const {
      agentName,
      agentCodeName,
      shieldEmail,
      clearancePassword,
      favoriteAvenger,
      role = 'user',
      adminKey
    } = req.body;

    if (!agentName || !shieldEmail || !clearancePassword) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (role === 'admin') {
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ error: 'Invalid or missing admin key' });
      }
    }

    const existingUser = await User.findOne({ shieldEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({
      agentName,
      agentCodeName,
      shieldEmail,
      clearancePassword,
      favoriteAvenger,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /login - Authenticate user and get token
router.post('/login', async (req, res) => {
  try {
    const { shieldEmail, clearancePassword } = req.body;

    if (!shieldEmail || !clearancePassword) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ shieldEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(clearancePassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        agentName: user.agentName, 
        shieldEmail: user.shieldEmail, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET all users (admin only)
router.get('/', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { agentName: regex },
        { agentCodeName: regex },
        { shieldEmail: regex }
      ];
    }

    const users = await User.find(query)
      .populate('favoriteAvenger')
      .select('-clearancePassword');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// GET user by ID (authenticated users)
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('favoriteAvenger')
      .select('-clearancePassword');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /api/users/:id - Update user details (must be authenticated)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const requesterId = req.user.id; // set by authenticateUser middleware
    const requesterRole = req.user.role;

    // Allow update only if user is admin or updating own profile
    if (requesterRole !== 'admin' && requesterId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    const updates = { ...req.body };

    // If clearancePassword is provided, hash it before saving
    if (updates.clearancePassword) {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updates.clearancePassword = await bcrypt.hash(updates.clearancePassword, salt);
    }

    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-clearancePassword'); // exclude password in response

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
