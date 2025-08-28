const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get current user profile
// Route: GET /api/users/me
// Access: Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // password hide
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update user preferences
// Route: PUT /api/users/preferences
// Access: Private
router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const { language, tone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only if provided
    if (language) user.preferences.language = language;
    if (tone) user.preferences.tone = tone;

    await user.save();
    res.json({ message: "Preferences updated", preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ Delete user account
// Route: DELETE /api/users/delete
// Access: Private
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
