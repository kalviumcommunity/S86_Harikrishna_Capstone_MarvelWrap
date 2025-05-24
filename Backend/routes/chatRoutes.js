import express from "express";
import Chatbox from "../models/chatbox.js";

const router = express.Router();

// GET all chatboxes
router.get("/", async (req, res) => {
  try {
    const chatboxes = await Chatbox.find();
    res.json(chatboxes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chatboxes" });
  }
});

// GET chatbox by ID
router.get("/:id", async (req, res) => {
  try {
    const chatbox = await Chatbox.findById(req.params.id);

    if (!chatbox) {
      return res.status(404).json({ error: "Chatbox not found" });
    }

    res.json(chatbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chatbox" });
  }
});

export default router;
