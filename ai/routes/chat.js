const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { addMessage, getConversation } = require("../utils/conversation");

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai
router.post("/", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!message || !sessionId)
    return res.status(400).json({ error: "sessionId and message are required" });

  try {
    // Add user message to conversation
    addMessage(sessionId, "user", message);

    // Get full conversation
    const conversation = getConversation(sessionId);

    // Call OpenAI chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the latest model
      messages: conversation,
      temperature: 0.7,
      max_tokens: 100,
    });

    const aiReply = response.choices[0].message.content.trim();

    // Add AI reply to conversation
    addMessage(sessionId, "assistant", aiReply);

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).json({ error: "AI response failed" });
  }
});

module.exports = router;
