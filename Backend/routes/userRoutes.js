import express from "express";
import {
  getUsers,
  getUserById,
  updateUser
} from "../controllers/userControllers.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), getUsers);
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);

export default router;