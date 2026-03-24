import express from "express";
import dotenv from "dotenv";
import ngrok from "ngrok";

import {
  loggingMiddleware,
  tokenVerificationMiddleware,
} from "./middlewares/middleware.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 5051;
const API_KEY = process.env.API_KEY;

// --- Middleware ---
app.use(loggingMiddleware);
app.use(tokenVerificationMiddleware(API_KEY));

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Hello! Server is running safely with ngrok.");
});

app.post("/api/test", (req, res) => {
  res.json({ message: "This is secure API data." });
});

// --- Start server and ngrok tunnel ---
const startServer = async () => {
  await ngrok.kill();
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Starting server...");
  const server = app.listen(PORT, async () => {
    try {
      console.log("Server is running on port:", PORT);
    } catch (err) {
      console.error("Ngrok ERROR:", err);
    }
  });

  const shutdown = async () => {
    console.log("Shutting down...");
    await ngrok.kill();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
