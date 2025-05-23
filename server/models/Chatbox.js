import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  agentCodeName: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const chatboxSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required: true,
  }],
  messages: [chatMessageSchema]
}, { timestamps: true });

export default mongoose.model('Chatbox', chatboxSchema);
