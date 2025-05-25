import express from 'express';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// GET all quiz results (optionally filter by user or quiz)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.user) {
      query.user = req.query.user;
    }
    if (req.query.quiz) {
      query.quiz = req.query.quiz;
    }

    const results = await QuizResult.find(query)
      .populate('user', 'username email')
      .populate('quiz', 'question');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get quiz results' });
  }
});

// GET quiz result by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.id)
      .populate('user', 'username email')
      .populate('quiz', 'question');
    
    if (!result) return res.status(404).json({ error: 'Quiz result not found' });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get quiz result' });
  }
});

// POST a new quiz result
router.post('/', async (req, res) => {
  try {
    const { user, quiz, answers, score } = req.body;

    if (!user || !quiz || !answers || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newResult = new QuizResult({
      user,
      quiz,
      answers,
      score
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

export default router;
