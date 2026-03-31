import crypto from "crypto";

const checkChatId = (chatId) => {
  return chatId.toString() === process.env.TELEGRAM_CHAT_ID;
};

// Verify Telegram initData
function verifyTelegramInitData(initData, botToken) {
  console.log("Verifying Telegram initData:", initData);
  if (!initData || !botToken) {
    throw new Error("Missing initData or botToken");
  }

  console.log("Verifying Telegram initData:", initData);

  // const dataObj = Object.fromEntries(
  //   initData.split("&").map((pair) => {
  //     const [key, ...valueParts] = pair.split("=");
  //     return [key, valueParts.join("=")];
  //   }),
  // );

  // const receivedHash = dataObj.hash;

  // if (!receivedHash) throw new Error("Missing hash in initData");
  // delete dataObj.hash;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) throw new Error("Missing hash in initData");

  params.delete("hash");

  // params.sort();

  // const dataCheckString = Object.entries(dataObj)
  //   .sort(([a], [b]) => a.localeCompare(b))
  //   .map(([k, v]) => `${k}=${v}`)
  //   .join("\n");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  console.log("==========================");
  console.log("==========================");
  console.log("HMAC:", hmac);
  console.log("Received Hash:", hash);
  console.log("==========================");
  console.log("==========================");

  if (hmac !== hash) throw new Error("Invalid Telegram initData signature");

  // const authDate = parseInt(dataObj.auth_date);
  // if (Date.now() / 1000 - authDate > 3600) return false;

  const authDate = parseInt(params.get("auth_date") || "0");
  if (Date.now() / 1000 - authDate > 3600) {
    // 1 hour
    throw new Error("Telegram initData expired");
  }

  const dataObj = Object.fromEntries(params);

  return dataObj;
}

export { checkChatId, verifyTelegramInitData };
