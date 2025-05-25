import express from "express";
import Quiz from "../models/quiz.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all quizzes (public)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "agentName shieldEmail"); // Adjust fields to your User model
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to get quizzes" });
  }
});

// GET quiz by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("createdBy", "agentName shieldEmail");

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to get quiz" });
  }
});

// POST create a new quiz (authenticated users only)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { question, options, correctAnswerIndex } = req.body;

    // Validate input
    if (!question || !options || options.length !== 4 || correctAnswerIndex === undefined) {
      return res.status(400).json({ error: "Please provide question, exactly 4 options, and correctAnswerIndex." });
    }

    const newQuiz = new Quiz({
      question,
      options,
      correctAnswerIndex,
      createdBy: req.user._id,
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

export default router;
