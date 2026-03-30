const checkChatId = (chatId) => {
  return chatId.toString() === process.env.TELEGRAM_CHAT_ID;
};

export { checkChatId };
