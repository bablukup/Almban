const { Context } = require("../models/Message");
const logger = require("./logger");

const getRecentContext = async (userId, sessionId, limit = 10) => {
  try {
    const context = await Context.findOne({ userId, sessionId });

    if (!context) {
      return {
        recentMessages: [],
        sessionBehavior: {},
      };
    }
    return {
      recentMessages: context.contextHistory.slice(-limit),
      sessionBehavior: context.multiSessionBehavior,
    };
  } catch (error) {
    console.error("Context retrieval failed:", error);
    return { recentMessages: [], sessionBehavior: {} };
  }
};

const updateContext = async (userId, sessionId, messageData) => {
  try {
    const contextUpdate = {
      messageText: messageData.messageText,
      aiResponse: messageData.aiResponse,
      emotion: messageData.emotion,
      timestamp: messageData.timestamp || new Date(),
    };

    // Find or create context
    let context = await Context.findOne({ userId, sessionId });
    if (!context) {
      context = new Context({
        userId,
        sessionId,
        contextHistory: [contextUpdate],
        multiSessionBehavior: {
          totalSessions: 1,
          averageSessionDuration: 0,
          preferredTimeSlots: [],
          commonTopics: [],
          communicationStyle: "casual",
        },
      });
    } else {
      // Add to history (keep last 50 messages)
      context.contextHistory.push(contextUpdate);
      if (context.contextHistory.length > 50) {
        context.contextHistory = context.contextHistory.slice(-50);
      }
    }
    await context.save();
    return context;
  } catch (error) {
    logger.error("Context update failed:", error);
    throw error;
  }
};

module.exports = { getRecentContext, updateContext };
