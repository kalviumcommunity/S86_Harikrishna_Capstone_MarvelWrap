import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      trim: true,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    agentCodeName: {
      type: String,
      trim: true,
      minlength: [3, "Code name should be at least 3 characters"],
    },
    shieldEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    clearancePassword: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    favoriteAvenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("clearancePassword") || this.isGoogleUser) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.clearancePassword = await bcrypt.hash(this.clearancePassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.clearancePassword);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.clearancePassword;
  return user;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
