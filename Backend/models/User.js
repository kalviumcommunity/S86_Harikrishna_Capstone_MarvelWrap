import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
    trim: true
  },
  agentCodeName: {
    type: String,
    trim: true
  },
  shieldEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  clearancePassword: {
    type: String,
    required: true
  },
  favoriteAvenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
