import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["marvel", "weapons", "characters", "movies", "comics"],
    required: true,
  },
  questionText: String,
  image: String,
  options: [String],
  correctAnswerIndex: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);