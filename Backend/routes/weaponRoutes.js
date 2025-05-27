import express from "express";
import Weapon from "../models/weapon.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { type: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const weapons = await Weapon.find(query).populate("wielder");
    res.json(weapons);
  } catch (err) {
    res.status(500).json({ error: "Failed to get weapons" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id).populate("wielder");
    if (!weapon) return res.status(404).json({ error: "Weapon not found" });
    res.json(weapon);
  } catch (err) {
    res.status(500).json({ error: "Failed to get weapon" });
  }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newWeapon = new Weapon(req.body);
    const saved = await newWeapon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create weapon" });
  }
});

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Weapon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Weapon not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update weapon" });
  }
});

export default router;
