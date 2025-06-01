import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import passport from "passport";
import "./config/googleauth.js";

import characterRoutes from "./routes/characterRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import comicRoutes from "./routes/comicRoutes.js";
import weaponRoutes from "./routes/weaponRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import { authenticateUser } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Initialize passport middleware
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("MarvelWrap backend running");
});

// Use your existing auth routes
app.use("/api/auth", authRoutes);

// Add Google OAuth routes (import the router)
import googleAuthRoutes from "./routes/googleRoutes.js";  // <-- Add this new import
app.use("/api/auth", googleAuthRoutes);             // <-- Add this new route

app.use("/api/users", userRoutes);
app.use("/api/battles", authenticateUser, battleRoutes);
app.use("/api/quizzes", authenticateUser, quizRoutes);
app.use("/api/chats", authenticateUser, chatRoutes);
app.use("/api/favorites", authenticateUser, favoriteRoutes);
app.use("/api/stats", authenticateUser, statsRoutes);

app.use("/api/characters", characterRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/comics", comicRoutes);
app.use("/api/weapons", weaponRoutes);
app.use("/api/search", searchRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});