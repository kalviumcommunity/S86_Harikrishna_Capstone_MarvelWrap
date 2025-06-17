import Battle from '../models/Battle.js';
import Character from '../models/Character.js';

const rolePowerBoosts = {
  Leader: 50,
  Tactician: 45,
  Tank: 45,
  Brawler: 40,
  Sorcerer: 40,
  TechGenius: 35,
  Assassin: 35,
  Speedster: 30,
  Sniper: 30,
  Support: 25
};

function calculateRoleBoost(roles = []) {
  if (!roles.length) return 20;
  return Math.max(...roles.map(role => rolePowerBoosts[role] || 0));
}

export const createBattle = async (req, res) => {
  try {
    const { teamAName, teamBName, teamAIds, teamBIds, autoGenerateTeamB } = req.body;

    if (!teamAName || !teamBName || !Array.isArray(teamAIds) || teamAIds.length !== 5) {
      return res.status(400).json({ error: 'Team A must have exactly 5 characters and a name' });
    }

    const allCharacterIds = [...teamAIds, ...(autoGenerateTeamB ? [] : teamBIds || [])];
    const characters = await Character.find({ _id: { $in: allCharacterIds } });

    const idMap = new Map(characters.map(c => [c._id.toString(), c]));

    const getTeam = (name, ids) => {
      const members = ids.map(id => {
        const character = idMap.get(id);
        const power = calculateRoleBoost(character?.roles);
        return { character: id, power };
      });
      return { name, members };
    };

    const teamA = getTeam(teamAName, teamAIds);

    let teamB;
    if (autoGenerateTeamB) {
      const remainingCharacters = await Character.find({ _id: { $nin: teamAIds } });
      const randomTeam = remainingCharacters.sort(() => 0.5 - Math.random()).slice(0, 5);
      const members = randomTeam.map(c => ({
        character: c._id,
        power: calculateRoleBoost(c.roles)
      }));
      teamB = { name: teamBName, members };
    } else {
      if (!Array.isArray(teamBIds) || teamBIds.length !== 5) {
        return res.status(400).json({ error: 'Team B must have exactly 5 characters if not auto-generating' });
      }
      teamB = getTeam(teamBName, teamBIds);
    }

    const usedIds = new Set([...teamA.members.map(m => m.character.toString()), ...teamB.members.map(m => m.character.toString())]);
    if (usedIds.size !== 10) {
      return res.status(400).json({ error: 'Characters must be unique across both teams' });
    }

    const countRoles = (team) => {
      const counts = {};
      for (const m of team.members) {
        const char = idMap.get(m.character.toString());
        char?.roles.forEach(r => counts[r] = (counts[r] || 0) + 1);
      }
      return counts;
    };

    const totalPowerA = teamA.members.reduce((sum, m) => sum + m.power, 0);
    const totalPowerB = teamB.members.reduce((sum, m) => sum + m.power, 0);

    const winner = totalPowerA === totalPowerB ? 'Draw' : totalPowerA > totalPowerB ? teamA.name : teamB.name;

    const battleLog = `Team A total: ${totalPowerA}, Team B total: ${totalPowerB}. Winner: ${winner}`;

    const battle = new Battle({ teamA, teamB, winner, createdBy: req.user._id, battleLog });
    const saved = await battle.save();

    res.status(201).json({
      _id: saved._id,
      teamA: { name: teamA.name, members: teamA.members.map(m => ({ character: m.character })) },
      teamB: { name: teamB.name, members: teamB.members.map(m => ({ character: m.character })) },
      winner,
      createdAt: saved.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create battle' });
  }
};

export const getBattles = async (req, res) => {
  try {
    const battles = await Battle.find({ createdBy: req.user._id })
      .populate('teamA.members.character')
      .populate('teamB.members.character');
    res.json(battles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch battles' });
  }
};