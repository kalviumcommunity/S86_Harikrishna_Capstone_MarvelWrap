import express from "express";
const router = express.Router();
import Character from "../models/Character.js";
import { authenticateUser, verifyAdmin } from "../middleware/authMiddleware.js";
// @route   GET /api/characters
// @desc    Get all characters
router.get("/", async (req, res) => {
  try {
    const characters = await Character.find().populate([
      "movies",
      "comics",
      "weapons",
    ]);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/characters/:id
// @desc    Get character by ID
router.get("/:id", async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate([
      "movies",
      "comics",
      "weapons",
    ]);
    if (!character)
      return res.status(404).json({ error: "Character not found" });
    res.json(character);
  } catch (err) {
    res.status(404).json({ error: "Character not found" });
  }
});

// @route   POST /api/characters
// @desc    Add new character (Admin only)
// @access  Private (Admin)
router.post("/", authenticateUser, verifyAdmin, async (req, res) => {
  try {
    const { name, alias, powers, description, image, movies, comics, weapons } =
      req.body;

    const newCharacter = new Character({
      name,
      alias,
      powers,
      description,
      image,
      movies,
      comics,
      weapons,
      createdBy: req.user.id, // from decoded JWT
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
