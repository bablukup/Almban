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

// CORS Configuration - DETAILED CORS MIDDLEWARE
const allowedOrigins = [
  "http://localhost:3000", // Create React App
  "http://localhost:5173", // Vite (your current setup)
  "http://localhost:3001",
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, postman, etc.)
      if (!origin) return callback(null, true);

      console.log("🌐 Request from origin:", origin);

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin allowed:", origin);
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        console.log("📋 Allowed origins:", allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Session-ID", "X-Requested-With"],
    credentials: true, // This requires specific origins, not wildcards
  })
);

// FALLBACK CORS MIDDLEWARE (like your old working code)
app.use(cors());

// Other Middleware
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
app.use("/api/messages", authMiddleware, messageRoutes);

// Protected route example
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle CORS errors specifically
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
    });
  }

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
      console.log(`🌐 Allowed origins:`, allowedOrigins);
      console.log("=========================\n");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
