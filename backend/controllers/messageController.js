const { Message, Emotion, Context, UserPreferences } = require("../models/Message");
const messageController = require("../controllers/messageController");
const aiResponse = require("../utils/aiResponse");
const contextManager = require("../utils/contextManager");
const sanitizer = require("../utils/sanitizer");
const logger = require("../utils/logger");
const emotionAnalyzer = require("../utils/emotionAnalyzer");

// Helper function for consistent API responses
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) response.data = data;

  return res.status(statusCode).json(response);
};

// Enhanced error handling with logging
const handleError = (res, error, customMessage = "Operation failed") => {
  logger.error(`Controller Error: ${error.message}`, {
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  let statusCode = 500;
  let message = customMessage;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed: " + error.message;
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Duplicate entry found";
  }

  return sendResponse(res, statusCode, false, message);
};

// ---------------- CREATE MESSAGE ----------------
exports.createMessage = async (req, res) => {
  const timeout = setTimeout(() => {
    return sendResponse(res, 408, false, "Request timeout");
  }, 30000);

  try {
    const { text, sessionId, messageType = "text" } = req.body;
    const userId = req.user._id;
    const startTime = Date.now(); // Start response time tracking

    // 1. Input Validation and Sanitization
    if (!text || !sessionId) {
      clearTimeout(timeout);
      return sendResponse(res, 400, false, "Missing required fields");
    }
    const sanitizedText = sanitizer.sanitizeText(text);

    // 2. AI Logic: Fetch Context, Preferences, and Emotion together
    const [userPreferences, conversationContext] = await Promise.all([
      // A. Fetch User Preferences
      UserPreferences.findOne({ userId }),
      // B. Fetch Conversation History Summary
      contextManager.getRecentContext(userId, sessionId),
    ]);

    // 3. Analyze Emotion from User's Message
    const emotionData = await emotionAnalyzer.analyzer(sanitizedText);

    // 4. Generate AI Response
    const aiData = await aiResponse.generate(sanitizedText, {
      userId,
      sessionId,
      emotion: emotionData,
      preferences: userPreferences,
      context: conversationContext,
    });

    // 5. Save new records in Database (Emotion, Context, Message)
    // A. Create Emotion record
    const emotion = new Emotion({
      emotion: emotionData.emotion,
      intensity: emotionData.intensity,
      emotionPatternFlags: emotionData.patterns || [],
      sarcasmDetected: emotionData.sarcasm || false,
      confidence: aiData.confidence || 0.8,
    });
    const savedEmotion = await emotion.save();

    // B. Update or Save Context record
    await contextManager.updateContext(userId, sessionId, {
      // This is the single messageData object
      messageText: sanitizedText,
      aiResponse: aiData.response,
      emotion: emotionData.emotion,
    });

    // C. Create Main Message record
    const newMessage = new Message({
      userId,
      text: sanitizedText,
      aiResponse: aiData.response,
      sessionId,
      messageType,
      emotionId: savedEmotion._id,
      quickMetadata: {
        responseTime: Date.now() - startTime,
        deviceType: req.headers["user-agent"]?.includes("Mobile") ? "mobile" : "desktop",
        browser: req.headers["user-agent"],
        messageLength: sanitizedText.length,
        emojiCount: (sanitizedText.match(/[\p{Emoji}]/gu) || []).length,
        emojiList: sanitizedText.match(/[\p{Emoji}]/gu)?.slice(0, 10) || [],
      },
      feedback: {
        aiConfidence: aiData.confidence || 0.8,
      },
    });

    const savedMessage = await newMessage.save();
    await savedMessage.populate("emotionId");

    // 6. Send Response
    clearTimeout(timeout);
    return sendResponse(res, 201, true, "Message created successfully", savedMessage);
  } catch (error) {
    clearTimeout(timeout);
    return handleError(res, error, "Failed to create message");
  }
};

// ---------------- GET MESSAGES ----------------
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, sessionId } = req.query;

    const filter = { userId };
    if (sessionId) filter.sessionId = sessionId;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Enhanced query performance
    const [messages, totalCount] = await Promise.all([
      Message.find(filter)
        .select("-__v")
        .populate("emotionId", "-__v")
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Message.countDocuments(filter),
    ]);

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalItems: totalCount,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
      hasPrevPage: pageNum > 1,
    };

    return sendResponse(res, 200, true, `Retrieved ${messages.length} messages`, {
      messages,
      pagination,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve messages");
  }
};

// ---------------- GET RECENT MESSAGES ----------------
exports.getRecentMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.getRecentByIdUser(userId, Math.min(limit, 50));

    return sendResponse(res, 200, true, `Retrieved ${messages.length} recent messages`, messages);
  } catch (error) {
    return handleError(res, error, "Failed to retrieve recent messages");
  }
};

// ---------------- GET MESSAGE BY ID ----------------
exports.getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({ _id: messageId, userId }).populate("emotionId");

    if (!message) {
      return sendResponse(res, 404, false, "Message not found");
    }

    return sendResponse(res, 200, true, "Message retrieved successfully", message);
  } catch (error) {
    return handleError(res, error, "Failed to retrieve message");
  }
};

// ---------------- GET SESSION MESSAGES ----------------
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({ userId, sessionId })
      .populate("emotionId")
      .sort({ timestamp: 1 });

    if (!messages || messages.length === 0) {
      return sendResponse(res, 404, false, "No messages found for this session");
    }

    return sendResponse(res, 200, true, `Retrieved ${messages.length} session messages`, messages);
  } catch (error) {
    return handleError(res, error, "Failed to retrieve session messages");
  }
};

// Enhanced feedback validation
exports.addFeedback = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    const { rating, thumbsUp, comment } = req.body;

    // Enhanced validation
    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return sendResponse(res, 400, false, "Rating must be an integer between 1 and 5");
    }

    if (comment && comment.length > 500) {
      return sendResponse(res, 400, false, "Comment too long (max 500 characters)");
    }

    const message = await Message.findOne({ _id: messageId, userId });

    if (!message) {
      return sendResponse(res, 404, false, "Message not found");
    }

    message.feedback = {
      ...message.feedback,
      rating,
      thumbsUp,
      comment: comment ? sanitizer.sanitizeText(comment) : undefined,
      submittedAt: new Date(),
    };

    await message.save();

    return sendResponse(res, 200, true, "Feedback added successfully", message.feedback);
  } catch (error) {
    return handleError(res, error, "Failed to add feedback");
  }
};
