import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
  },
  powers: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL of character image
    required: true,
  },
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  }],
  comics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic',
  }],
  weapons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weapon',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Character', characterSchema);
