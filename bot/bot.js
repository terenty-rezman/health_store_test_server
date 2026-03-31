import crypto from "crypto";

const checkChatId = (chatId) => {
  return chatId.toString() === process.env.TELEGRAM_CHAT_ID;
};

// Verify Telegram initData
function verifyTelegramInitData(initData, botToken) {
  // console.log("Verifying Telegram initData:", initData);
  // console.log("Using botToken:", botToken ? "Provided" : "Missing");
  if (!initData) return false;

  const dataObj = Object.fromEntries(
    initData.split("&").map((pair) => pair.split("=")),
  );

  console.log("Parsed initData object:", dataObj);

  const receivedHash = dataObj.hash;

  console.log("Received hash:", receivedHash);

  delete dataObj.hash;

  const dataCheckString = Object.entries(dataObj)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");

  console.log("Data check string:", dataCheckString);

  const secretKey = crypto
    .createHash("sha256", "WebAppData")
    .update(botToken)
    .digest();

  console.log(
    "Derived secret key (SHA-256 of bot token):",
    secretKey.toString("hex"),
  );

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  console.log("Calculated HMAC:", hmac);

  console.log(
    `Verification result: ${hmac === receivedHash ? "valid" : "invalid"}`,
  );

  return hmac === receivedHash;
}

export { checkChatId, verifyTelegramInitData };
