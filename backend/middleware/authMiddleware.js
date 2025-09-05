const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  try {
    // Check JWT_SECRET at runtime instead of load time
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Verify Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Use 'Bearer <token>'",
      });
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user and verify existence
    // const user = await User.findById(decoded._id).select("-password -__v").lean();
    const userId = new mongoose.Types.ObjectId(decoded._id);
    const user = await User.findById(userId).select("-password -__v").lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token invalid",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);

    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

module.exports = authMiddleware;
