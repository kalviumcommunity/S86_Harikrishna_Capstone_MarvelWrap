import express from "express";
import Character from "../models/Character.js";
import Movie from "../models/Movie.js"
import Comic from "../models/Comic.js";
import Weapon from "../models/Weapon.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/characters", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const regex = new RegExp(searchTerm, "i");
    const characters = await Character.find({
      $or: [
        { name: regex },
        { alias: regex },
        { description: regex }
      ]
    }).populate("movies comics weapons");
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: "Error fetching characters" });
  }
});

router.get("/movies", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const regex = new RegExp(searchTerm, "i");
    const movies = await Movie.find({
      $or: [
        { title: regex },
        { director: regex },
        { genre: regex }
      ]
    }).populate("characters");
    res.json(movies);
  } catch {
    res.status(500).json({ error: "Error fetching movies" });
  }
});

router.get("/comics", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const regex = new RegExp(searchTerm, "i");
    const comics = await Comic.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).populate("characters");
    res.json(comics);
  } catch {
    res.status(500).json({ error: "Error fetching comics" });
  }
});

router.get("/weapons", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const regex = new RegExp(searchTerm, "i");
    const weapons = await Weapon.find({
      $or: [
        { name: regex },
        { type: regex }
      ]
    }).populate("wielder");
    res.json(weapons);
  } catch {
    res.status(500).json({ error: "Error fetching weapons" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const regex = new RegExp(searchTerm, "i");
    const users = await User.find({
      $or: [
        { agentName: regex },
        { email: regex }
      ]
    }).populate("favoriteAvenger");
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
