import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getWeapons,
  getWeaponById,
  createWeapon,
  updateWeapon,
} from "../controllers/weaponControllers.js";

const router = express.Router();

router.get("/", getWeapons);
router.get("/:id", getWeaponById);
router.post("/", verifyToken, verifyAdmin, createWeapon);
router.put("/:id", verifyToken, verifyAdmin, updateWeapon);

export default router;
