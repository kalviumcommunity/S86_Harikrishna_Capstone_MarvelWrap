import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Weapon from '../models/weapon.js';
import Character from '../models/Character.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedWeapons = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await Weapon.deleteMany();

    let character = await Character.findOne();
    if (!character) {
      character = await Character.create({
        name: 'Dummy Character',
        alias: 'None',
        powers: ['None'],
        description: 'Placeholder character for weapon seeding.',
        image: 'https://dummyimage.com/ironman',
        movies: [],
        comics: [],
        weapons: [],
        createdBy: new mongoose.Types.ObjectId(),
      });
    }

    const weapons = [
      {
        name: 'Mjolnir',
        type: 'Hammer',
        wielder: character._id,
        description: 'The enchanted hammer wielded by Thor.',
        image: 'https://link-to-mjolnir-image.jpg',
      },
      {
        name: 'Iron Man Suit',
        type: 'Armor',
        wielder: character._id,
        description: 'Advanced powered armor worn by Tony Stark.',
        image: 'https://link-to-ironman-suit.jpg',
      },
      {
        name: 'Web Shooters',
        type: 'Gadget',
        wielder: character._id,
        description: 'Mechanical web shooters used by Spider-Man.',
        image: 'https://link-to-web-shooters.jpg',
      }
    ];

    await Weapon.insertMany(weapons);
    console.log("Weapons seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Seeding weapons failed:", error);
    process.exit(1);
  }
};

seedWeapons();
