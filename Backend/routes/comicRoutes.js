import express from "express";
import Comic from "../models/comic.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};
    const comics = await Comic.find(query).populate("characters").populate("createdBy", "username email");
    res.json(comics);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comics" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id).populate("characters").populate("createdBy", "username email");
    if (!comic) return res.status(404).json({ error: "Comic not found" });
    res.json(comic);
  } catch (err) {
    res.status(500).json({ error: "Failed to get comic" });
  }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newComic = new Comic({ ...req.body, createdBy: req.user._id });
    const saved = await newComic.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create comic" });
  }
});

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Comic not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update comic" });
  }
});

export default router;
