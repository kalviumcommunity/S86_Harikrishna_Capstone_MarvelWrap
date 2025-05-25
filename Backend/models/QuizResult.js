import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
      },
      selectedOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3
      }
    }
  ],
  score: {
    type: Number,
    required: true
  },
  takenAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('QuizResult', quizResultSchema);
