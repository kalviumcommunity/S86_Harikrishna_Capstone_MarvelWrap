import express from "express";
import Quiz from "../models/quiz.js";

const router = express.Router();

// GET all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "username email");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to get quizzes" });
  }
});

// GET quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("createdBy", "username email");

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to get quiz" });
  }
});

export default router;
