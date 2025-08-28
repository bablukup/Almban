const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true },
    preferences: {
      language: { type: String, default: "en" },
      tone: { type: String, default: "friendly" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
