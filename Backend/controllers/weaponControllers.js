import Weapon from "../models/Weapon.js";

export const getWeapons = async (req, res) => {
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
};

export const getWeaponById = async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id).populate("wielder");
    if (!weapon) return res.status(404).json({ error: "Weapon not found" });
    res.json(weapon);
  } catch (err) {
    res.status(500).json({ error: "Failed to get weapon" });
  }
};

export const createWeapon = async (req, res) => {
  try {
    const newWeapon = new Weapon(req.body);
    const saved = await newWeapon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create weapon" });
  }
};

export const updateWeapon = async (req, res) => {
  try {
    const updated = await Weapon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Weapon not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update weapon" });
  }
};
