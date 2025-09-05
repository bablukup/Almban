const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

// THIS IS THE CORRECT LOCATION TO IMPORT authMiddleware
const authMiddleware = require("./middleware/authMiddleware");

// Load env vars first
dotenv.config();
console.log("JWT_SECRET at startup:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;

// Check required env vars
if (!dbUrl) {
  console.error("ATLASDB_URL is not defined in environment variables");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
    service: "Almban API",
    uptime: process.uptime(),
  });
});

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Almban API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// New message routes
// Now, authMiddleware is defined before it's used
app.use("/api/messages", authMiddleware, messageRoutes);

// Protected route example
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB(dbUrl);
    app.listen(PORT, () => {
      console.log("\n=== Almban API Server ===");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log(`🔒 Protected route: http://localhost:${PORT}/api/me`);
      console.log("=========================\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
