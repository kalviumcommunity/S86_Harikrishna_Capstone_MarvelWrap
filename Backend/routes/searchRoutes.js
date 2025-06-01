import express from "express";
import {
  searchCharacters,
  searchMovies,
  searchComics,
  searchWeapons,
  searchUsers
} from "../controllers/searchControllers.js";

const router = express.Router();

router.get("/characters", searchCharacters);
router.get("/movies", searchMovies);
router.get("/comics", searchComics);
router.get("/weapons", searchWeapons);
router.get("/users", searchUsers);

export default router; 