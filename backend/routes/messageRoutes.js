const express = require("express");
const router = express.Router();
const { body, query, param } = require("express-validator");
const rateLimit = require("express-rate-limit");

// Controllers
const messageController = require("../controllers/messageController");
const emotionController = require("../controllers/emotionController");
const analyticsController = require("../controllers/analyticsController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

// ---------------- Rate Limiting ----------------
const messageRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute per user
  message: {
    error: "Too many messages. Please wait before sending more.",
    retryAfter: "60 seconds",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id, // Rate limit per user
});

// ---------------- Validation Rules ----------------
const createMessageValidation = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage("Message text must be between 1 and 4000 characters"),

  body("messageType")
    .optional()
    .isIn(["text", "voice", "emoji", "image", "file", "code"])
    .withMessage("Invalid message type"),

  body("sessionId")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("Valid session ID is required"),
];

const getMessagesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sessionId")
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("Invalid session ID"),
];

// ---------------- MESSAGE CRUD ROUTES ----------------

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  messageRateLimit,
  createMessageValidation,
  validationMiddleware.handleValidationErrors,
  messageController.createMessage
);

/**
 * @route   GET /api/messages
 * @desc    Get user's messages with filtering and pagination
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  getMessagesValidation,
  validationMiddleware.handleValidationErrors,
  cacheMiddleware.cache(300), // 5 minutes cache
  messageController.getMessages
);

/**
 * @route   GET /api/messages/recent
 * @desc    Get user's recent messages (last 20)
 * @access  Private
 */
router.get(
  "/recent",
  authMiddleware,
  cacheMiddleware.cache(60), // 1 minute cache
  messageController.getRecentMessages
);

/**
 * @route   GET /api/messages/:messageId
 * @desc    Get a specific message by ID
 * @access  Private
 */
router.get(
  "/:messageId",
  authMiddleware,
  param("messageId").isMongoId().withMessage("Invalid message ID format"),
  validationMiddleware.handleValidationErrors,
  messageController.getMessageById
);

/**
 * @route   GET /api/messages/session/:sessionId
 * @desc    Get all messages from a specific session
 * @access  Private
 */
router.get(
  "/session/:sessionId",
  authMiddleware,
  param("sessionId").isString().withMessage("Invalid session ID format"),
  validationMiddleware.handleValidationErrors,
  cacheMiddleware.cache(300),
  messageController.getSessionMessages
);

/**
 * @route   POST /api/messages/:messageId/feedback
 * @desc    Add feedback to a message
 * @access  Private
 */
router.post(
  "/:messageId/feedback",
  authMiddleware,
  param("messageId").isMongoId().withMessage("Invalid message ID format"),
  [
    body("rating").optional().isInt({ min: 1, max: 5 }),
    body("thumbsUp").optional().isBoolean(),
    body("comment").optional().isLength({ max: 500 }).trim(),
  ],
  validationMiddleware.handleValidationErrors,
  messageController.addFeedback
);

module.exports = router;
