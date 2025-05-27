import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "", 
  },
  options: {
    type: [String],
    required: true,
    validate: v => v.length === 4,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: {
    type: [questionSchema],
    validate: v => v.length === 5,
  },
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
