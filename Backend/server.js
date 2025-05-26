import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

import characterRoutes from './routes/characterRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import comicRoutes from './routes/comicRoutes.js';
import weaponRoutes from './routes/weaponRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import quizResultRoutes from './routes/quizResultRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

import { authenticateUser } from './middleware/authMiddleware.js';

dotenv.config();
console.log("JWT_SECRET is:", process.env.JWT_SECRET);

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('MarvelWrap backend running');
});

// Public routes
app.use('/api/characters', characterRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comics', comicRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chats', chatRoutes);

// Routes requiring auth middleware
// For example, users, teams, quiz results might need authentication
app.use('/api/users', userRoutes);
app.use('/api/teams', authenticateUser, teamRoutes);
app.use('/api/quizresults', authenticateUser, quizResultRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
