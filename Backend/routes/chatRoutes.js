import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getChatboxes,
  getChatboxById,
  createChatbox,
  joinChatbox,
  addMessageToChatbox,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", getChatboxes);
router.get("/:id", getChatboxById);
router.post("/", verifyToken, createChatbox);
router.put("/:id/join", verifyToken, joinChatbox);
router.put("/:id/messages", verifyToken, addMessageToChatbox);

export default router;