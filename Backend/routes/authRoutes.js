import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.post('/logout', authenticateUser, (req, res) => {
  res.json({ message: 'Logged out successfully. Please delete your token on client side.' });
});

router.get('/profile', authenticateUser, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      agentName: req.user.agentName,
      shieldEmail: req.user.shieldEmail,
      role: req.user.role,
      favoriteAvenger: req.user.favoriteAvenger || null,
    });
  } catch (error) {
    console.error('Profile fetch error:', error); 
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router; 