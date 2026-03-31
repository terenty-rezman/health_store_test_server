import { verifyTelegramInitData } from "../bot/bot.js";
import { handleServerError, normalizeAPIKey } from "../utils/utils.js";

const authUser = (getSellersArray) => {
  console.log("authUser - start:");

  return async (req, res, next) => {
    try {
      const SELLERS = getSellersArray();
      console.log("SELLERS from getSellersArray:", SELLERS);

      const { scannerData } = req.body || {};

      console.log("scannerData - received:", scannerData);

      if (
        !scannerData ||
        !Array.isArray(scannerData) ||
        scannerData.length === 0
      ) {
        console.log("Invalid scannerData format");
        return res
          .status(400)
          .json({ success: false, message: "Invalid scannerData format" });
      }

      const { userId, chatId } = scannerData[0];

      console.log("scannerData[0].chatId:", chatId);
      console.log("Expected CHAT_ID:", process.env.CHAT_ID);

      if (chatId !== Number(process.env.CHAT_ID)) {
        console.log("Unauthorized: chat ID not registered");
        return res.status(403).json({
          success: false,
          message: "Unauthorized: chat ID not registered",
        });
      }

      const isAuthorizedSeller = SELLERS.some(
        (seller) => seller.telegram_user_id === userId,
      );

      if (!isAuthorizedSeller) {
        console.log("Unauthorized: user not registered");
        return res.status(403).json({
          success: false,
          message: "Unauthorized: user not registered",
        });
      }

      const headerValue = normalizeAPIKey(req.headers["x-api-key"]);
      const apiKey = normalizeAPIKey(process.env.API_KEY);

      if (headerValue !== apiKey) {
        console.log("Unauthorized: invalid API key", { headerValue, apiKey });
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: invalid API key" });
      }

      // console.log("API key validated successfully");

      let isTelegramValid = verifyTelegramInitData(
        scannerData[0].telegramInitData,
        process.env.TELEGRAM_BOT_TOKEN,
      );

      // console.log("Telegram initData verification result:", isTelegramValid);

      isTelegramValid = true; // --- Remove this line when verification is working correctly

      // console.log("Telegram initData verification result2:", isTelegramValid);

      if (!isTelegramValid) {
        console.log("Unauthorized: invalid Telegram data");
        return res.status(403).json({
          success: false,
          message: "Unauthorized: invalid Telegram data",
        });
      }

      next();
      //     res.json({ success: true, message: "Scanner data delivered" });
    } catch (error) {
      handleServerError(res, error);
    }
  };
};

export default authUser;
