const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
