import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['Character', 'Movie', 'Weapon', 'Comic'],
    required: true
  }
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
