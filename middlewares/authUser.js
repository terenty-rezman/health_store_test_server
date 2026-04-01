import { verifyTelegramInitData } from "../bot/bot.js";
import {
  handleServerError,
  isAuthorizedSeller,
  normalizeAPIKey,
} from "../utils/utils.js";

const authUser = (getSellersArray) => {
  console.log("authUser - start:");

  return async (req, res, next) => {
    try {
      const SELLERS = getSellersArray();

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

      const { userId, chatId, telegramInitData } = scannerData[0];

      try {
        const verifiedData = verifyTelegramInitData(
          telegramInitData,
          process.env.TELEGRAM_BOT_TOKEN,
        );
        const user = JSON.parse(verifiedData.user)
        req.telegramUserId = Number(user.id);
      } catch (error) {
        console.error("Error verifying Telegram initData:", error);
        return res.status(403).json({
          success: false,
          message: "Unauthorized: invalid Telegram data",
        });
      }

      next();
    } catch (error) {
      handleServerError(res, error);
    }
  };
};

export default authUser;
