import mongoose from 'mongoose';

const battleTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
      required: true
    },
    power: { type: Number, required: true }
  }]
});

const battleSchema = new mongoose.Schema({
  teamA: battleTeamSchema,
  teamB: battleTeamSchema,
  winner: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Battle', battleSchema);
