const { callOpenClaw } = require("../../utils/openclaw.utils");

exports.competitorAnalysis = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  const aiPrompt = `
You are a marketing analyst.

Analyze competitors for:
what the user enter in his request
IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not use \`\`\`json.
Do not add explanations before or after the JSON.

JSON schema:

{
  "summary": "string",
  "competitors": [
    {
      "name": "string",
      "strengths": ["string"],
      "weaknesses": ["string"]
    }
  ],
  "trends": [
    {
      "title": "string",
      "importance": "high | medium | low"
    }
  ],
  "recommendations": ["string"]
}


User request:
${prompt}`;

  try {
    const response = await callOpenClaw(aiPrompt);
    return res.json({ result: response });
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ error: error.message, details: error.details });
    }
    return res.status(500).json({ error: error.message });
  }
};