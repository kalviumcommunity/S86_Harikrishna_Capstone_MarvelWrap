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

// POST create new chatbox
router.post("/", async (req, res) => {
  try {
    const { participants } = req.body;

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Participants array is required" });
    }

    const newChatbox = new Chatbox({ participants, messages: [] });
    await newChatbox.save();

    res.status(201).json(newChatbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chatbox" });
  }
});

// POST add message to a chatbox
router.post("/:id/messages", async (req, res) => {
  try {
    const { agentCodeName, message } = req.body;

    if (!agentCodeName || !message) {
      return res.status(400).json({ error: "agentCodeName and message are required" });
    }

    const chatbox = await Chatbox.findById(req.params.id);
    if (!chatbox) {
      return res.status(404).json({ error: "Chatbox not found" });
    }

    chatbox.messages.push({ agentCodeName, message });
    await chatbox.save();

    res.status(201).json(chatbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to add message" });
  }
});

export default router;
