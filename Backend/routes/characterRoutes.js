import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
} from "../controllers/characterControllers.js";

const router = express.Router();

router.get("/", getCharacters);
router.get("/:id", getCharacterById);
router.post("/", verifyToken, verifyAdmin, createCharacter);
router.put("/:id", verifyToken, verifyAdmin, updateCharacter);

export default router;
