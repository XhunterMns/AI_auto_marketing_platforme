const axios = require("axios");

async function sendToTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  // Allow chat id to come from env, fallback to default
  const chatId =
    process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_GROUP_ID || -1004351186921;

  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN in environment");
  }

  if (!chatId) {
    throw new Error("Missing TELEGRAM_CHAT_ID in environment");
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
      },
      {
        timeout: 15000,
      }
    );
  } catch (err) {
    const status = err?.response?.status;
    const description =
      err?.response?.data?.description || err?.message || err?.code || "unknown";
    // Re-throw with status attached so the worker can decide to retry
    const wrapped = new Error(
      `Telegram send failed (status=${status ?? "?"}): ${description}`
    );
    wrapped.status = status;
    wrapped.response = err?.response;
    throw wrapped;
  }
}

module.exports = { sendToTelegram };
