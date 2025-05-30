import User from '../models/User.js';
import mongoose from 'mongoose';
import generateToken from '../utils/generateToken.js';

const signupUser = async (req, res) => {
  try {
    const { agentName, agentCodeName, shieldEmail, clearancePassword, favoriteAvenger } = req.body;

    // Validate favoriteAvenger ObjectId
    if (!mongoose.Types.ObjectId.isValid(favoriteAvenger)) {
      return res.status(400).json({ error: 'Invalid favoriteAvenger ID' });
    }

    const userExists = await User.findOne({ shieldEmail });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = await User.create({
      agentName,
      agentCodeName,
      shieldEmail,
      clearancePassword,
      favoriteAvenger
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        agentName: user.agentName,
        shieldEmail: user.shieldEmail,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { shieldEmail, clearancePassword } = req.body;

    const user = await User.findOne({ shieldEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(clearancePassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      agentName: user.agentName,
      shieldEmail: user.shieldEmail,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export { signupUser, loginUser };
