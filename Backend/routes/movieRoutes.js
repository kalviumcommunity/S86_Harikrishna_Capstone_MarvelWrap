import express from "express";
import Movie from "../models/movie.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};
    const movies = await Movie.find(query).populate("characters").populate("createdBy", "username email");
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Failed to get movies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("characters").populate("createdBy", "username email");
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to get movie" });
  }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newMovie = new Movie({ ...req.body, createdBy: req.user._id });
    const saved = await newMovie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create movie" });
  }
});

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Movie not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update movie" });
  }
});

export default router;
