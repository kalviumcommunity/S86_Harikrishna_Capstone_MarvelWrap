import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  agentCodeName: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const chatboxSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   
        required: true,
      },
    ],
    messages: [chatMessageSchema],
    password: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chatbox", chatboxSchema);
