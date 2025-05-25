import express from "express";
import Comic from "../models/comic.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // adjust path if needed

const router = express.Router();

// GET all comics (optional search by title)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const comics = await Comic.find(query)
      .populate("characters")
      .populate("createdBy", "username email");

    res.json(comics);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comics" });
  }
});

// GET comic by ID
router.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id)
      .populate("characters")
      .populate("createdBy", "username email");

    if (!comic) return res.status(404).json({ error: "Comic not found" });

    res.json(comic);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comic" });
  }
});

// POST new comic (admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Only admins can create comics." });
    }

    const { title, issueNumber, releaseDate, characters, description, coverImage } = req.body;

    const newComic = new Comic({
      title,
      issueNumber,
      releaseDate,
      characters,
      description,
      coverImage,
      createdBy: req.user._id,
    });

    const savedComic = await newComic.save();
    res.status(201).json(savedComic);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comic" });
  }
});

export default router;
