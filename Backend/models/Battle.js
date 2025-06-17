import mongoose from 'mongoose';

const battleTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
      power: { type: Number, required: true }
    }
  ]
});

const battleSchema = new mongoose.Schema({
  teamA: battleTeamSchema,
  teamB: battleTeamSchema,
  winner: { type: String },
  battleLog: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Battle = mongoose.model('Battle', battleSchema);
export default Battle;
