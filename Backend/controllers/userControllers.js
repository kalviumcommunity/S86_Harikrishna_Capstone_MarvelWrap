import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [
        { agentName: regex },
        { agentCodeName: regex },
        { shieldEmail: regex }
      ];
    }

    const users = await User.find(query)
      .populate("favoriteAvenger")
      .select("-clearancePassword");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("favoriteAvenger")
      .select("-clearancePassword");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requesterId = req.user._id.toString();
    const requesterRole = req.user.role;

    if (requesterRole !== "admin" && requesterId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this user" });
    }

    const updates = { ...req.body };

    if (updates.clearancePassword) {
      const salt = await bcrypt.genSalt(10);
      updates.clearancePassword = await bcrypt.hash(updates.clearancePassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-clearancePassword");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};
