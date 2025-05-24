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
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Import your routes (which include controller logic)
import characterRoutes from './routes/characterRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import comicRoutes from './routes/comicRoutes.js';
import weaponRoutes from './routes/weaponRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('MarvelWrap backend running');
});

// Use routes
app.use('/api/characters', characterRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comics', comicRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
