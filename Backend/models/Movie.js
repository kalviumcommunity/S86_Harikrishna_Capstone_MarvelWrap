import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String, // URL to image
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
