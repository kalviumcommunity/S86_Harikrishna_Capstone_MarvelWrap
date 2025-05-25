import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /signup - Register new user
router.post('/signup', async (req, res) => {
  try {
    const { agentName, agentCodeName, shieldEmail, clearancePassword, favoriteAvenger } = req.body;

    if (!agentName || !shieldEmail || !clearancePassword) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ shieldEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(clearancePassword, 10);

    const newUser = new User({
      agentName,
      agentCodeName,
      shieldEmail,
      clearancePassword: hashedPassword,
      favoriteAvenger
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

    const isMatch = await bcrypt.compare(clearancePassword, user.clearancePassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, agentName: user.agentName, shieldEmail: user.shieldEmail, role: user.role } });
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

export default router;
