import express from "express";
import Team from "../models/team.js";

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

export default router;
