import express from "express";
import Movie from "../models/movie.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Adjust path as needed

const router = express.Router();

// GET all movies (optional search by title)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const movies = await Movie.find(query)
      .populate("characters")
      .populate("createdBy", "username email");

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Failed to get movies" });
  }
});

// GET movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("characters")
      .populate("createdBy", "username email");

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to get movie" });
  }
});

// POST new movie (admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Only admins can create movies." });
    }

    const { title, releaseDate, characters, description, poster } = req.body;

    const newMovie = new Movie({
      title,
      releaseDate,
      characters,
      description,
      poster,
      createdBy: req.user._id,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).json({ error: "Failed to create movie" });
  }
});

export default router;
