import Character from "../models/Character.js";

export const getCharacters = async (req, res) => {
  try {
    const isSummary = req.query.summary === "true";
    const query = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    if (isSummary) {
      const characters = await Character.find(query).select("name image");
      return res.json(characters);
    } else {
      const characters = await Character.find(query).populate("movies comics weapons");
      return res.json(characters);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get characters" });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate("movies comics weapons");
    if (!character) return res.status(404).json({ error: "Character not found" });
    res.json(character);
  } catch (err) {
    res.status(500).json({ error: "Failed to get character" });
  }
};

export const createCharacter = async (req, res) => {
  try {
    const character = new Character({ ...req.body, createdBy: req.user._id });
    const saved = await character.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Character Creation Error:", err);
    res.status(400).json({ error: "Failed to create character" });
  }
};

export const updateCharacter = async (req, res) => {
  try {
    const updated = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Character not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update character" });
  }
};
