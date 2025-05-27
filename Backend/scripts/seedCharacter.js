import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Character from '../models/Character.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedCharacters = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('Connected to DB');

    await Character.deleteMany();

    const dummyUserId = new mongoose.Types.ObjectId();

    const characters = [
      {
        name: 'Iron Man',
        alias: 'Tony Stark',
        powers: ['Genius intellect', 'Powered armor suit'],
        description: 'A wealthy American business magnate, playboy, philanthropist, and ingenious scientist.',
        image: 'https://link-to-ironman-image.jpg',
        movies: [],
        comics: [],
        weapons: [],
        createdBy: dummyUserId,
      },
      {
        name: 'Thor',
        alias: 'God of Thunder',
        powers: ['Superhuman strength', 'Weather manipulation', 'Flight'],
        description: 'The Asgardian god of thunder who wields the mystical hammer Mjolnir.',
        image: 'https://link-to-thor-image.jpg',
        movies: [],
        comics: [],
        weapons: [],
        createdBy: dummyUserId,
      },
      {
        name: 'Spider-Man',
        alias: 'Peter Parker',
        powers: ['Wall-crawling', 'Spider-sense', 'Super agility'],
        description: 'A teenage superhero with spider-like abilities fighting crime in New York City.',
        image: 'https://link-to-spiderman-image.jpg',
        movies: [],
        comics: [],
        weapons: [],
        createdBy: dummyUserId,
      }
    ];

    await Character.insertMany(characters);

    console.log('Characters seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedCharacters();
