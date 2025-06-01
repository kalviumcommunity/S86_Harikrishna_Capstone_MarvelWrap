import bcrypt from "bcrypt";
import Chatbox from "../models/Chatbox.js";

export const getChatboxes = async (req, res) => {
  try {
    const chatboxes = await Chatbox.find()
      .select("-password")
      .sort({ updatedAt: -1 });
    res.json(chatboxes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chatboxes" });
  }
};

export const getChatboxById = async (req, res) => {
  try {
    const chatbox = await Chatbox.findById(req.params.id).select("-password");
    if (!chatbox) return res.status(404).json({ error: "Chatbox not found" });
    res.json(chatbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chatbox" });
  }
};

export const createChatbox = async (req, res) => {
  try {
    const { participants, password } = req.body;

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Participants array is required" });
    }

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newChatbox = new Chatbox({
      participants,
      messages: [],
      password: hashedPassword,
      createdBy: req.user._id,
    });

    await newChatbox.save();

    const { password: _, ...chatboxWithoutPassword } = newChatbox.toObject();
    res.status(201).json(chatboxWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chatbox" });
  }
};

export const joinChatbox = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id.toString();

    const chatbox = await Chatbox.findById(req.params.id);
    if (!chatbox) return res.status(404).json({ error: "Chatbox not found" });

    if (chatbox.password) {
      if (!password) {
        return res.status(400).json({ error: "Password is required to join this chatbox" });
      }
      const isMatch = await bcrypt.compare(password, chatbox.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    }

    if (!chatbox.participants.includes(userId)) {
      chatbox.participants.push(userId);
      await chatbox.save();
    }

    const { password: _, ...chatboxWithoutPassword } = chatbox.toObject();
    res.json(chatboxWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: "Failed to join chatbox" });
  }
};

export const addMessageToChatbox = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id.toString();

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatbox = await Chatbox.findById(req.params.id);
    if (!chatbox) return res.status(404).json({ error: "Chatbox not found" });

    if (!chatbox.participants.includes(userId)) {
      return res.status(403).json({ error: "You must join this chatbox before sending messages" });
    }

    chatbox.messages.push({
      agentCodeName: req.user.username || userId,
      message: message.trim(),
      sentAt: new Date(),
    });

    await chatbox.save();

    res.status(201).json(chatbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to add message" });
  }
};
