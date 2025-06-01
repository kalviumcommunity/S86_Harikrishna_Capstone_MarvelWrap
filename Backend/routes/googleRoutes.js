import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"],prompt: "select_account" }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send(`
  <h1>MarvelWrap login successful! ✨</h1>
  <p>Your access token:</p>
  <p>${token}</p>
  <p>Use this token to access protected features.</p>
  <p>Frontend update coming soon to handle this token automatically!</p>
`);
  }
);

export default router;
