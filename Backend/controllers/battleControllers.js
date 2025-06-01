import Battle from '../models/Battle.js';
import Character from '../models/Character.js';

export const createBattle = async (req, res) => {
  try {
    const { teamAName, teamBName, teamAIds, teamBIds } = req.body;

    if (
      !teamAName || !teamBName ||
      !Array.isArray(teamAIds) || !Array.isArray(teamBIds) ||
      teamAIds.length !== 5 || teamBIds.length !== 5
    ) {
      return res.status(400).json({ error: "Both teams must have 5 characters and names" });
    }

    const allIds = [...teamAIds, ...teamBIds];
    const uniqueIds = new Set(allIds.map(String));
    if (uniqueIds.size !== 10) {
      return res.status(400).json({ error: "Characters must be unique across both teams" });
    }

    const characters = await Character.find({ _id: { $in: allIds } });

    const teamA = {
      name: teamAName,
      members: characters.filter(c => teamAIds.includes(c._id.toString())).map(c => ({
        character: c._id,
        power: Math.floor(Math.random() * 100) + 1,
      })),
    };

    const teamB = {
      name: teamBName,
      members: characters.filter(c => teamBIds.includes(c._id.toString())).map(c => ({
        character: c._id,
        power: Math.floor(Math.random() * 100) + 1,
      })),
    };

    const totalPowerA = teamA.members.reduce((sum, m) => sum + m.power, 0);
    const totalPowerB = teamB.members.reduce((sum, m) => sum + m.power, 0);

    const winner =
      totalPowerA === totalPowerB ? 'Draw' : totalPowerA > totalPowerB ? teamA.name : teamB.name;

    const battle = new Battle({
      teamA,
      teamB,
      winner,
      createdBy: req.user._id,
    });

    const savedBattle = await battle.save();

    res.status(201).json(savedBattle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create battle" });
  }
};

export const getBattles = async (req, res) => {
  try {
    const battles = await Battle.find({ createdBy: req.user._id })
      .populate('teamA.members.character')
      .populate('teamB.members.character');
    res.json(battles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch battles" });
  }
};
