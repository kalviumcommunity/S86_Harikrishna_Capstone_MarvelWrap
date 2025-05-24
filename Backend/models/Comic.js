import mongoose from 'mongoose';

const comicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issueNumber: {
    type: Number,
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
  coverImage: {
    type: String, 
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Comic', comicSchema);
