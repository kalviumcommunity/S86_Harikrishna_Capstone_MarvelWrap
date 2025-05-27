import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

import characterRoutes from './routes/characterRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import comicRoutes from './routes/comicRoutes.js';
import weaponRoutes from './routes/weaponRoutes.js';
import userRoutes from './routes/userRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js'

import { authenticateUser } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('MarvelWrap backend running');
});

app.use('/api/characters', characterRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comics', comicRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use('/api/battles', authenticateUser, battleRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
