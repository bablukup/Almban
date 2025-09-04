const mongoose = require("mongoose");

// ------------------ Separate Collection Schemas ------------------

// Emotion as separate collection (reusable)
const EmotionSchema = new mongoose.Schema({
  emotion: {
    type: String,
    enum: ["happy", "sad", "angry", "neutral", "excited", "confused"],
    required: true,
    index: true,
  },
  intensity: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 1;
      },
      message: "Intensity must be between 0 and 1",
    },
  },
  emotionPatternFlags: [
    {
      type: String,
      enum: ["repeated_negative", "stress_indicator", "mood_swing", "anxiety_pattern"],
    },
  ],
  sarcasmDetected: { type: Boolean, default: false },
  confidence: { type: Number, min: 0, max: 1, default: 0.8 },
  createdAt: { type: Date, default: Date.now },
});

// Context as separate collection
const ContextSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: String, required: true, index: true },
  contextHistory: [
    {
      messageText: { type: String, maxlength: 1000 },
      aiResponse: { type: String, maxlength: 2000 },
      emotion: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  multiSessionBehavior: {
    averageSessionDuration: { type: Number, default: 0 }, // in minutes
    totalSessions: { type: Number, default: 1 },
    preferredTimeSlots: [{ type: String }], // morning, afternoon, evening
    commonTopics: [{ type: String }],
    communicationStyle: {
      type: String,
      enum: ["formal", "casual", "technical", "emotional"],
      default: "casual",
    },
  },
  lastUpdated: { type: Date, default: Date.now },
});

// User Preferences as separate collection (more flexible)
const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  language: {
    type: String,
    enum: ["en", "hi", "es", "fr", "de"],
    default: "en",
    index: true,
  },
  tone: {
    type: String,
    enum: ["friendly", "formal", "sarcastic", "professional", "casual"],
    default: "friendly",
  },
  theme: {
    type: String,
    enum: ["dark", "light", "auto"],
    default: "light",
  },
  responseStyle: {
    type: String,
    enum: ["short", "detailed", "simple", "complex", "bullet_points"],
    default: "detailed",
  },
  // New useful preferences
  timezone: { type: String, default: "UTC" },
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
  },
  accessibilitySettings: {
    highContrast: { type: Boolean, default: false },
    fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    screenReader: { type: Boolean, default: false },
  },
  lastUpdated: { type: Date, default: Date.now },
});

// ------------------ Main Message Schema (Optimized) ------------------
const MessageSchema = new mongoose.Schema(
  {
    // Core message data
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 4000,
      trim: true,
    },
    aiResponse: {
      type: String,
      maxlength: 8000,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    messageType: {
      type: String,
      enum: ["text", "voice", "emoji", "image", "file", "code"],
      default: "text",
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

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
      browser: { type: String, maxlength: 50 },
      responseTime: { type: Number }, // milliseconds
      messageLength: { type: Number }, // auto-calculated
      emojiCount: { type: Number, default: 0 },
      emojiList: [{ type: String, maxlength: 10 }], // store actual emojis
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

ContextSchema.index({ userId: 1, sessionId: 1 });
ContextSchema.index({ lastUpdated: -1 });

EmotionSchema.index({ emotion: 1, intensity: -1 });
EmotionSchema.index({ createdAt: -1 });

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
MessageSchema.statics.getRecentByUser = function (userId, limit = 20) {
  return this.find({ userId }).sort({ timestamp: -1 }).limit(limit).populate("emotionId").exec();
};

MessageSchema.statics.getSessionMessages = function (sessionId) {
  return this.find({ sessionId }).sort({ timestamp: 1 }).populate("emotionId").exec();
};

MessageSchema.statics.getEmotionAnalytics = function (userId, days = 30) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), timestamp: { $gte: dateLimit } } },
    { $lookup: { from: "emotions", localField: "emotionId", foreignField: "_id", as: "emotion" } },
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
};

// ------------------ Export Models ------------------
const Message = mongoose.model("Message", MessageSchema);
const Emotion = mongoose.model("Emotion", EmotionSchema);
const Context = mongoose.model("Context", ContextSchema);
const UserPreferences = mongoose.model("UserPreferences", UserPreferencesSchema);

module.exports = {
  Message,
  Emotion,
  Context,
  UserPreferences,
};
