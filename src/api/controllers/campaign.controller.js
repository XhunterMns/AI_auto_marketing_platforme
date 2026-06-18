const { callOpenClaw } = require("../../utils/openclaw.utils");
const { splitCampaignByDays } = require("../../utils/campaign.utils");
const campaignQueue = require("../../../queue");

exports.generateCampaign = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  
const aiPrompt = `
You are a marketing copywriter.

Create a marketing campaign.

STRICT RULES:

- Return plain text only.
- No introductions.
- No conclusions.
- No markdown.
- No emojis.
- Each day must start exactly with:

Day 1:
Day 2:
Day 3:

Format example:

Day 1:
Message for day 1

Day 2:
Message for day 2

Day 3:
Message for day 3

User request:
${prompt}`;

  try {
    // 1. get OpenClaw output
    const response = await callOpenClaw(aiPrompt);

    // 2. split into days
    const days = splitCampaignByDays(response);

    const now = Date.now();

    // 3. schedule in BullMQ
    const jobs = [];

for (let i = 0; i < days.length; i++) {
  await campaignQueue.add(
    "sendCampaign",
    {
      day: days[i].day,
      message: days[i].message,
    },
    {
      delay: i * 10000, // test: every 10 seconds mba3ed bech tetbadel l real scheduling (e.g. 1 day = 24*60*60*1000 ms)
    }
  );


    }

    return res.json({
      success: true,
      message: "Campaign scheduled successfully",
      totalDays: days.length,
      response: response,
      jobs,
    });

  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: error.message,
        details: error.details,
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};
