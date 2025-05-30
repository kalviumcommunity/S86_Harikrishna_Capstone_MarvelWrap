import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.post('/logout', authenticateUser, (req, res) => {
  res.json({ message: 'Logged out successfully. Please delete your token on client side.' });
});

router.get('/profile', authenticateUser, (req, res) => {
  res.json({ message: `Hello, ${req.user.agentName}. This is your protected profile.` });
});

export default router;
