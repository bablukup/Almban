const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Connect DB
connectDB(dbUrl);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
