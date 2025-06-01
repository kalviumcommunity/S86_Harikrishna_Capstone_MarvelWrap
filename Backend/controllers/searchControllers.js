import Character from "../models/Character.js";
import Movie from "../models/Movie.js";
import Comic from "../models/Comic.js";
import Weapon from "../models/Weapon.js";
import User from "../models/User.js";

const buildRegex = (term) => new RegExp(term || "", "i");

export const searchCharacters = async (req, res) => {
  try {
    const regex = buildRegex(req.query.search);
    const characters = await Character.find({
      $or: [
        { name: regex },
        { alias: regex },
        { description: regex }
      ]
    }).populate("movies comics weapons");
    res.json(characters);
  } catch {
    res.status(500).json({ error: "Error fetching characters" });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const regex = buildRegex(req.query.search);
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
};

export const searchComics = async (req, res) => {
  try {
    const regex = buildRegex(req.query.search);
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
};

export const searchWeapons = async (req, res) => {
  try {
    const regex = buildRegex(req.query.search);
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
};

export const searchUsers = async (req, res) => {
  try {
    const regex = buildRegex(req.query.search);
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
};
