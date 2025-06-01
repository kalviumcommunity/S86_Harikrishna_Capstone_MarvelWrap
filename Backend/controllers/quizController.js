import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length !== 5) {
      return res.status(400).json({ error: "Title and exactly 5 questions are required" });
    }

    for (const q of questions) {
      if ((!q.questionText?.trim() && !q.image?.trim())) {
        return res.status(400).json({ error: "Each question must have text, image, or both" });
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ error: "Each question must have 4 options" });
      }
      if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
        return res.status(400).json({ error: "Invalid correctAnswerIndex in one of the questions" });
      }
    }

    const newQuiz = new Quiz({
      title,
      questions,
      createdBy: req.user._id,
    });

    const saved = await newQuiz.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "username");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: "Answers must match the number of questions" });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((q, idx) => {
      const correct = q.correctAnswerIndex === answers[idx];
      if (correct) score++;
      results.push({
        questionText: q.questionText,
        image: q.image,
        yourAnswer: q.options[answers[idx]],
        correctAnswer: q.options[q.correctAnswerIndex],
        isCorrect: correct,
      });
    });

    let message = "";
    if (score === 5) message = "🎉 Congratulations! You're a Marvel Master!";
    else if (score >= 3) message = "👍 Good job! You know quite a bit!";
    else message = "👀 Better luck next time! Keep exploring the Marvel Universe.";

    res.json({
      score,
      total: quiz.questions.length,
      message,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};