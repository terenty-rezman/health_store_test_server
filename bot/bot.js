import crypto from "crypto";

const checkChatId = (chatId) => {
  return chatId.toString() === process.env.TELEGRAM_CHAT_ID;
};

// Verify Telegram initData
function verifyTelegramInitData(initData, botToken) {
  // console.log(
  //   "========================================\n========================================\n========================================",
  // );
  console.log("Verifying Telegram initData:", initData);
  // console.log("Using botToken:", botToken ? "Provided" : "Missing");
  if (!initData) return false;

  const dataObj = Object.fromEntries(
    initData.split("&").map((pair) => {
      const [key, ...valueParts] = pair.split("=");
      return [key, decodeURIComponent(valueParts.join("="))]; // handle values with =
    }),
  );

  // console.log("Parsed initData object:", dataObj);

  const receivedHash = dataObj.hash;

  // console.log("Received hash:", receivedHash);
  if (!receivedHash) return false;
  delete dataObj.hash;

  const dataCheckString = Object.entries(dataObj)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // console.log("Data check string:", dataCheckString);

  const secretKey = crypto
    .createHash("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // console.log(
  //   "Derived secret key (SHA-256 of bot token):",
  //   secretKey.toString("hex"),
  // );

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const authDate = parseInt(dataObj.auth_date);
  if (Date.now() / 1000 - authDate > 3600) return false;

  // console.log("Received hash :", receivedHash);
  // console.log("Calculated HMAC:", hmac);
  // console.log("Match?", hmac === receivedHash);

  return hmac === receivedHash;
}

export { checkChatId, verifyTelegramInitData };
