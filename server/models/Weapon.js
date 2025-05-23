import mongoose from 'mongoose';

const weaponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  wielder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL to image
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Weapon', weaponSchema);
