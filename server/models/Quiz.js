import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'A quiz must have exactly 4 options']
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 4;
}

export default mongoose.model('Quiz', quizSchema);
