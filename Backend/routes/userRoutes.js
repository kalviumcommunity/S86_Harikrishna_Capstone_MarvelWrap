import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET all users (optional search by agentName or agentCodeName)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [
        { agentName: regex },
        { agentCodeName: regex },
        { shieldEmail: regex }
      ];
    }

    const users = await User.find(query)
      .populate("favoriteAvenger");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("favoriteAvenger");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
