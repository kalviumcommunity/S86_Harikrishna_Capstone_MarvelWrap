import express from "express";
import Team from "../models/team.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

// GET all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("members")
      .populate("createdBy", "username email");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to get teams" });
  }
});

// GET team by ID
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members")
      .populate("createdBy", "username email");

    if (!team) return res.status(404).json({ error: "Team not found" });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to get team" });
  }
});

// POST create a new team (admin only)
router.post("/", authenticateUser, authorizeRoles('admin'), async (req, res) => {  try {
    // Only admin can create
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied, admin only" });
    }

    const { name, members } = req.body;
    if (!name || !members || !Array.isArray(members)) {
      return res.status(400).json({ error: "Name and members array are required" });
    }

    const newTeam = new Team({
      name,
      members,
      createdBy: req.user._id,
    });

    const savedTeam = await newTeam.save();

    res.status(201).json(savedTeam);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team" });
  }
});

export default router;
