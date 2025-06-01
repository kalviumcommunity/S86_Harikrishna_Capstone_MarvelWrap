import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { getComics, getComicById, createComic, updateComic } from "../controllers/comicControllers.js";

const router = express.Router();

router.get("/", getComics);
router.get("/:id", getComicById);
router.post("/", verifyToken, verifyAdmin, createComic);
router.put("/:id", verifyToken, verifyAdmin, updateComic);

export default router;