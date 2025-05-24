import express from 'express';
const router = express.Router();
import Character from '../models/Character.js';
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    res.json(character);
  } catch (err) {
    res.status(404).json({ error: 'Character not found' });
  }
});

export default router;