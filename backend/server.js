const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
