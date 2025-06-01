import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ shieldEmail: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            agentName: profile.displayName || "Unknown Agent",
            shieldEmail: profile.emails[0].value,
            clearancePassword: "google-auth-default-password",
            agentCodeName: `Agent${Math.floor(Math.random() * 1000)}`,
            isGoogleUser : true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);