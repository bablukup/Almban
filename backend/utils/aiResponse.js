// Simple AI response generator (can be enhanced with OpenAI/other APIs)
const logger = require("./logger");

const responseTemplates = {
  happy: [
    "That's wonderful! I'm so glad to hear that!",
    "How exciting! Tell me more about what's making you happy.",
    "That sounds amazing! I love your positive energy.",
  ],
  sad: [
    "I understand that must be difficult. I'm here to listen.",
    "That sounds tough. Would you like to talk about it?",
    "I'm sorry you're going through this. How can I help?",
  ],
  angry: [
    "I can hear your frustration. Let's work through this.",
    "I understand your concern. What would help right now?",
    "That does sound frustrating. Tell me more about what happened.",
  ],
  excited: [
    "That's amazing! I can feel your excitement!",
    "How thrilling! What's got you so energized?",
    "Wow, that sounds incredible! Share more details!",
  ],
  confused: [
    "Let me help clarify that for you.",
    "I understand the confusion. Let's break this down.",
    "That can be puzzling. What specific part is unclear?",
  ],
  neutral: [
    "I see. Tell me more about that.",
    "I understand. How can I help you with this?",
    "That's interesting. What would you like to explore further?",
  ],
};

/**
 * Generates AI response based on input text and emotion
 * @param {string} text - User input text
 * @param {Object} options - Generation options
 * @returns {Object} Generated response with metadata
 */
const generate = async (text, options = {}) => {
  try {
    const { emotion = { emotion: "neutral", intensity: 0.5 } } = options;
    if (!text || typeof text !== "string") {
      throw new Error("Invalid input text");
    }

    // Get appropriate response template
    const templateSet = responseTemplates[emotion.emotion] || responseTemplates.neutral;
    const randomIndex = Math.floor(Math.random() * templateSet.length);
    let response = templateSet[randomIndex];

    // Add context-aware elements
    if (text.includes("?")) {
      response += " I'd be happy to help answer your question.";
    }
    if (emotion.intensity > 0.7) {
      response += " I can sense this is really important to you.";
    }

    return {
      response: response.trim(),
      // Use confidence from the analyzer
      confidence: options.emotion?.confidence ?? 0.5,
      tokensUsed: response.split(" ").length,
      emotion: emotion.emotion,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("AI response generation failed:", {
      error: error.message,
      text: text?.substring(0, 100),
      options,
    });

    // This is the key fix. We are returning a complete and valid object.
    return {
      response: "I'm sorry, I'm having trouble with that. Can you try rephrasing?",
      confidence: 0.3,
      // tokensUsed: 0,
      emotion: "neutral",
      // error: error.message,
      // timestamp: new Date().toISOString(),
    };
  }
};

module.exports = {
  generate,
};
