import Question from "../models/Quiz.js";

export const addQuestion = async (req, res) => {
  try {
    const { category, questionText, image, options, correctAnswerIndex } = req.body;

    if (!["marvel", "weapons", "characters", "movies", "comics"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if ((!questionText?.trim() && !image?.trim()) ||
        !Array.isArray(options) || options.length !== 4 ||
        typeof correctAnswerIndex !== "number" || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
      return res.status(400).json({ error: "Invalid question format" });
    }

    const question = new Question({
      category,
      questionText,
      image,
      options,
      correctAnswerIndex,
      createdBy: req.user._id,
    });

    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add question" });
  }
};

export const getRandomQuestions = async (req, res) => {
  try {
    const { category } = req.params;

    if (!["marvel", "weapons", "characters", "movies", "comics"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size: 5 } }
    ]);

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { questionIds, answers } = req.body;

    if (!Array.isArray(questionIds) || !Array.isArray(answers) || questionIds.length !== 5 || answers.length !== 5) {
      return res.status(400).json({ error: "5 question IDs and answers are required" });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    const results = [];

    questions.forEach((q, idx) => {
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
    if (score === 5) message = "🎉 You're a Marvel Master!";
    else if (score >= 3) message = "👍 Great job!";
    else message = "👀 Better luck next time!";

    res.json({
      score,
      total: 5,
      message,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Quiz submission failed" });
  }
};
