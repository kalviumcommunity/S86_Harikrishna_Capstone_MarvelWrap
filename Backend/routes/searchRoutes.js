import express from "express";
import Character from "../models/Character.js";
import Movie from "../models/movie.js";
import Comic from "../models/comic.js";
import Weapon from "../models/weapon.js";
import User from "../models/user.js";
import Team from "../models/team.js";
import Quiz from "../models/quiz.js";

const router = express.Router();

router.get("/characters", async (req, res) => {
  try {
    const characters = await Character.find({
      name: new RegExp(req.query.name || "", "i"),
    }).populate("movies comics weapons");
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: "Error fetching characters" });
  }
});

router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({
      title: new RegExp(req.query.title || "", "i"),
    }).populate("characters");
    res.json(movies);
  } catch {
    res.status(500).json({ error: "Error fetching movies" });
  }
});

router.get("/comics", async (req, res) => {
  try {
    const comics = await Comic.find({
      title: new RegExp(req.query.title || "", "i"),
    }).populate("characters");
    res.json(comics);
  } catch {
    res.status(500).json({ error: "Error fetching comics" });
  }
});

router.get("/weapons", async (req, res) => {
  try {
    const weapons = await Weapon.find({
      name: new RegExp(req.query.name || "", "i"),
    }).populate("wielder");
    res.json(weapons);
  } catch {
    res.status(500).json({ error: "Error fetching weapons" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({
      agentName: new RegExp(req.query.agentName || "", "i"),
    }).populate("favoriteAvenger");
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find({
      name: new RegExp(req.query.name || "", "i"),
    }).populate("members");
    res.json(teams);
  } catch {
    res.status(500).json({ error: "Error fetching teams" });
  }
});

router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      question: new RegExp(req.query.question || "", "i"),
    });
    res.json(quizzes);
  } catch {
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});

export default router;
