import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie
} from "../controllers/movieControllers.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", verifyToken, verifyAdmin, createMovie);
router.put("/:id", verifyToken, verifyAdmin, updateMovie);

export default router;