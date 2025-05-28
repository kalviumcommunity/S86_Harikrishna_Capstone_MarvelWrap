import express from 'express';
import Character from '../models/Character.js';
import Movie from '../models/Movie.js';
import Weapon from '../models/Weapon.js';
import Comic from '../models/Comic.js';
import Favorite from '../models/Favorite.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [characters, movies, weapons, comics, favorites] = await Promise.all([
      Character.countDocuments(),
      Movie.countDocuments(),
      Weapon.countDocuments(),
      Comic.countDocuments(),
      Favorite.countDocuments()
    ]);

    res.json({
      totalCharacters: characters,
      totalMovies: movies,
      totalWeapons: weapons,
      totalComics: comics,
      totalFavorites: favorites
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
