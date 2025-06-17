import express from "express";
import { addQuestion, getRandomQuestions, submitQuiz } from "../controllers/quizController.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/add", authenticateUser, addQuestion);
router.get("/random/:category", getRandomQuestions);
router.post("/submit", submitQuiz);

export default router;
