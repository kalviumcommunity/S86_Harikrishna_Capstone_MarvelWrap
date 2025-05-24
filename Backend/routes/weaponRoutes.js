import express from "express";
import Weapon from "../models/weapon.js";

const router = express.Router();

// GET all weapons (optional search by name or type)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [{ name: regex }, { type: regex }];
    }

    const weapons = await Weapon.find(query)
      .populate("wielder");

    res.json(weapons);
  } catch (err) {
    res.status(500).json({ error: "Failed to get weapons" });
  }
});

// GET weapon by ID
router.get("/:id", async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id)
      .populate("wielder");

    if (!weapon) return res.status(404).json({ error: "Weapon not found" });

    res.json(weapon);
  } catch (err) {
    res.status(500).json({ error: "Failed to get weapon" });
  }
});

export default router;
