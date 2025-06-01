import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { createBattle, getBattles } from '../controllers/battleControllers.js';

const router = express.Router();

router.post('/', authenticateUser, createBattle);
router.get('/', authenticateUser, getBattles);

export default router; 