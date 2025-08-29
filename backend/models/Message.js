const mongoose = require("mongoose");

// ------------------ Main Message Schema ------------------
const MessageSchema = new mongoose.Schema(
  {
    // Core message data
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true, maxlength: 4000, trim: true },
    aiResponse: { type: String, maxlength: 8000, trim: true }, // optional
    timestamp: { type: Date, default: Date.now, index: true },

    messageType: {
      type: String,
      enum: ["text", "voice", "emoji", "image", "file", "code"],
      default: "text",
      index: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    // Extra fields for emotional support logic
    emotion: {
      type: String,
      enum: ["happy", "sad", "neutral", "angry", "anxious"],
      default: "neutral",
    },
    topic: { type: String, trim: true },

    // References to other collections (normalized approach)
    emotionId: { type: mongoose.Schema.Types.ObjectId, ref: "Emotion" },
    contextId: { type: mongoose.Schema.Types.ObjectId, ref: "Context" },

    // Lightweight embedded data (frequently accessed)
    quickMetadata: {
      deviceType: {
        type: String,
        enum: ["mobile", "desktop", "tablet"],
        default: "desktop",
      },
      browser: { type: String, maxlength: 100 },
      responseTime: { type: Number }, // milliseconds
      messageLength: { type: Number }, // auto-calculated
      emojiCount: { type: Number, default: 0 },
      emojiList: [{ type: String, maxlength: 10 }],
    },
    // Feedback (keep embedded as it's 1:1 with message)
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: Number.isInteger,
          message: "Rating must be an integer between 1 and 5",
        },
      },
      thumbsUp: { type: Boolean },
      comment: { type: String, maxlength: 500 },
      aiConfidence: { type: Number, min: 0, max: 1, default: 0.8 },
      submittedAt: { type: Date },
    },
    // Status flags
    isProcessed: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    hasAttachments: { type: Boolean, default: false },
  },
  {
    // Schema options
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// ------------------ Indexes for Performance ------------------
MessageSchema.index({ userId: 1, timestamp: -1 }); // user's recent messages
MessageSchema.index({ sessionId: 1, timestamp: 1 }); // session chronology
MessageSchema.index({ messageType: 1, timestamp: -1 }); // by type
MessageSchema.index({ "feedback.rating": 1 }); // feedback analysis

// ------------------ Virtual Fields ------------------
MessageSchema.virtual("responseTimeFormatted").get(function () {
  if (this.quickMetadata.responseTime) {
    return `${this.quickMetadata.responseTime}ms`;
  }
  return "N/A";
});

MessageSchema.virtual("emotionSummary", {
  ref: "Emotion",
  localField: "emotionId",
  foreignField: "_id",
  justOne: true,
});

// ------------------ Middleware ------------------
// Auto-calculate message length
MessageSchema.pre("save", function (next) {
  if (this.text) {
    // Add max length check
    if (this.text.length > 4000) {
      return next(new Error("Message text exceeds maximum length"));
    }
    this.quickMetadata.messageLength = this.text.length;
    // Count emojis (simple regex)
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
    const emojis = this.text.match(emojiRegex) || [];
    this.quickMetadata.emojiCount = emojis.length;
    this.quickMetadata.emojiList = emojis.slice(0, 10); // limit to first 10
  }
  next();
});
// ------------------ Static Methods ------------------
MessageSchema.statics.getRecentByIdUser = function (userId, limit = 20) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("emotionId")
    .exec();
};
MessageSchema.statics.getSessionMessages = function (sessionId) {
  return this.find({ sessionId })
    .sort({ timestamp: 1 })
    .populate("emotionId")
    .exec();
};
MessageSchema.statics.getEmotionAnalytics = function (userId, days = 30) {
  try {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    return this.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          timestamp: { $gte: dateLimit },
        },
      },
      {
        $lookup: {
          from: "emotions",
          localField: "emotionId",
          foreignField: "_id",
          as: "emotion",
        },
      },
      { $unwind: "$emotion" },
      {
        $group: {
          _id: "$emotion.emotion",
          count: { $sum: 1 },
          avgIntensity: { $avg: "$emotion.intensity" },
        },
      },
      { $sort: { count: -1 } },
    ]);
  } catch (error) {
    console.error("Error in emotion analytics:", error);
    throw error;
  }
};
module.exports = mongoose.model("Message", MessageSchema);
