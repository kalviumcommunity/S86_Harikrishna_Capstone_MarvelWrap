import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

userSchema.pre('save', async function(next) {
  if (!this.isModified('clearancePassword')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.clearancePassword = await bcrypt.hash(this.clearancePassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.clearancePassword);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
