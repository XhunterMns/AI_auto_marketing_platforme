const { sendToTelegram } = require("../../utils/posting.utils");

exports.sendPostToTelegram = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message in request body" });
  }

  try {
    await sendToTelegram(message);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data,
    });
  }
};
