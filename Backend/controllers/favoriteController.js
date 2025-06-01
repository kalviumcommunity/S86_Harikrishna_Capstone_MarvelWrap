import Favorite from "../models/Favorite.js";
import Character from "../models/Character.js";
import Movie from "../models/Movie.js";
import Weapon from "../models/Weapon.js";
import Comic from "../models/Comic.js";

export const addFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    if (
      !itemId ||
      !itemType ||
      !["Character", "Movie", "Weapon", "Comic"].includes(itemType)
    ) {
      return res.status(400).json({ error: "Invalid itemId or itemType" });
    }

    const existing = await Favorite.findOne({ user: req.user._id, itemId, itemType });
    if (existing) {
      return res.status(409).json({ error: "Item already in favorites" });
    }

    const favorite = new Favorite({
      user: req.user._id,
      itemId,
      itemType,
    });

    const saved = await favorite.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });

    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        let item = null;

        switch (fav.itemType) {
          case "Character":
            item = await Character.findById(fav.itemId);
            break;
          case "Movie":
            item = await Movie.findById(fav.itemId);
            break;
          case "Weapon":
            item = await Weapon.findById(fav.itemId);
            break;
          case "Comic":
            item = await Comic.findById(fav.itemId);
            break;
        }

        return {
          _id: fav._id,
          itemType: fav.itemType,
          item,
          createdAt: fav.createdAt,
        };
      })
    );

    res.json(populatedFavorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};
