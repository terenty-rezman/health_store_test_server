import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ngrok from "ngrok";
import { handleNodemonRestart, handleServerError } from "./utils/utils.js";

import {
  loggingMiddleware,
  tokenVerificationMiddleware,
} from "./middlewares/middleware.js";

import TelegramBot from "node-telegram-bot-api";
import { checkChatId } from "./bot/bot.js";

dotenv.config();

const webAppUrl_scanner = "https://e293-45-156-22-143.ngrok-free.app/front/scanner.html";


const sellers = new Map([
  [763910115, { name: "Seller2", telegram_id: 763910115 }],
]);


const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());

const PORT = Number(process.env.PORT) || 8080;
const API_KEY = process.env.API_KEY;

// const url = process.env.NGROK_DOMAIN || (await ngrok.connect(PORT));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new telegramBot(TOKEN);
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Telegram bot running...");

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

// app.post(`/bot${TOKEN}`, (req, res) => {
//   bot.processUpdate(req.body);
//   console.log("Telegram update received:", req.body);
//   res.sendStatus(200);
// });

// bot
//   .setWebHook(`${url}/bot${TOKEN}`)
//   .then(() => console.log("Webhook set"))
//   .catch((err) => console.error(err));

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.text === '/start') {

        if (!sellers.has(chatId)) {
            bot.sendMessage(chatId, `Unauthorized access. You are not registered as a seller.\n Your Telegram ID: ${chatId}`);
        }
        else {
            bot.sendMessage(chatId, 
                'AgACAgIAAxkBAAEKHFxpa_vsbDbT2PMUh6IGx-7mhl2myQACvwxrG01UYEuIl19rH-5qRAEAAwIAA3gAAzgE',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Открыть Сканер', web_app: {url: webAppUrl_scanner}}]
                        ]
                    }
                });
        }
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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (checkChatId(chatId)) {
    bot.sendMessage(chatId, "Message received: " + msg.text);
    console.log("Message received:", msg.text);
  } else {
    console.log("Received message from unauthorized chat ID:", chatId);
  }
});

startServer();
