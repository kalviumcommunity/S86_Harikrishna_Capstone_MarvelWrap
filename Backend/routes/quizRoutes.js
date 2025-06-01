import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/", authenticateUser, createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/submit", authenticateUser, submitQuiz);

export default router;