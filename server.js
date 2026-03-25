import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ngrok from "ngrok";
import { handleNodemonRestart, handleServerError } from "./utils/utils.js";

import {
  loggingMiddleware,
  tokenVerificationMiddleware,
} from "./middlewares/middleware.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

const PORT = Number(process.env.PORT) || 8080;
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

app.post("/api/test/scanner-data", (req, res) => {
  try {
    const { scannerData } = req.body;

    // throw new Error("Test failure");
    console.log("scannerData - received", scannerData);
    res.json({ success: true, message: "Scanner data delivered" });
  } catch (error) {
    handleServerError(res, error);
  }
});

// --- Start server and ngrok tunnel ---
let isShuttingDown = false;

const startServer = async () => {
  await ngrok.kill();
  await new Promise((r) => setTimeout(r, 1000));

  const server = app.listen(PORT, async () => {
    try {
      console.log("Server is running on port:", PORT);
    } catch (err) {
      console.error("Ngrok ERROR:", err);
    }
  });

  const shutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log("Shutting down server and ngrok tunnel...");

    try {
      await ngrok.kill();
      console.log("Ngrok stopped.");
    } catch (err) {
      console.error("Error stopping ngrok:", err);
    }

    server.close(() => {
      console.log("Server stopped.");
      console.log("COMPLETED - Server and ngrok fully stopped.");
      process.exit(0);
    });

    setTimeout(() => {
      console.log("Force shutdown.");
      process.exit(1);
    }, 3000);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.once("SIGUSR2", () => handleNodemonRestart(shutdown));
};

startServer();
