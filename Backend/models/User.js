import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    agentName: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
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
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    favoriteAvenger: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("clearancePassword")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.clearancePassword = await bcrypt.hash(this.clearancePassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare input password with hashed password
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
