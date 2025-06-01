import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { addFavorite, getFavorites } from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/", authenticateUser, addFavorite);
router.get("/", authenticateUser, getFavorites);

export default router;