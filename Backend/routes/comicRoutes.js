import express from "express";
import Comic from "../models/comic.js";

const router = express.Router();

// Get all comics (optional search by title)
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

// Get comic by ID
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

export default router;
