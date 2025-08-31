const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "message_created",
        "feedback_submitted",
        "session_started",
        "session_ended",
        "user_login",
        "user_logout",
        "preference_updated",
        "error_occurred",
      ],
      index: true,
    },
    data: {
      // For message_created
      messageType: {
        type: String,
        enum: ["text", "voice", "emoji", "image", "file", "code"],
      },
      emotion: String,
      responseTime: Number,
      textLength: Number,
      aiConfidence: Number,

      // For feedback_submitted
      messageId: mongoose.Schema.Types.ObjectId,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      thumbsUp: Boolean,
      hasComment: Boolean,

      // For session events
      sessionDuration: Number,
      messageCount: Number,

      // For errors
      errorType: String,
      errorMessage: String,

      // Common fields
      deviceType: String,
      browser: String,
      timeStamp: {
        type: Date,
        default: Date.now,
      },

      // Custom data
      customData: mongoose.Schema.Types.Mixed,
    },
    metaData: {
      ipAddress: {
        type: String,
        validate: {
          validator: function (v) {
            return /^(\d{1,3}\.){3}\d{1,3}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid IP address!`,
        },
      },
      userAgent: String,
      referrer: String,
      timeZone: String,
    },
  },
  {
    timestamps: true,
    // TTL index for automatic cleanup after 1 year
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  }
);

// Indexes for performance
AnalyticsSchema.index({ userId: 1, eventType: 1, "data.timeStamp": -1 });
AnalyticsSchema.index({ "data.timeStamp": -1 });
AnalyticsSchema.index({ eventType: 1, "data.timeStamp": -1 });
AnalyticsSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Static methods for common analytics queries
AnalyticsSchema.statics.getUserActivity = function (
  userId,
  startDate,
  endDate
) {
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId format");
  }

  // Validate dates
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error("Invalid date format");
  }
  try {
    return this.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          "data.timeStamp": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
          avgResponseTime: { $avg: "$data.responseTime" },
          emotions: { $push: "$data.emotion" },
        },
      },
      { $sort: { count: -1 } },
    ]);
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    throw error;
  }
};
AnalyticsSchema.statics.getSystemMetrics = function (startDate, endDate) {
  try {
    return this.aggregate([
      {
        $match: {
          "data.timeStamp": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%y-%m-%d", date: "$data.timeStamp" },
            eventType: "$eventType",
          },
          count: { $sum: 1 },
          uniqueUser: { $addToSet: "$userId" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          events: {
            $push: {
              type: "$_id.eventType",
              count: "$count",
              uniqueUsers: { $size: "$uniqueUsers" },
            },
          },
          totalEvents: { $sum: "$count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  } catch (error) {
    console.error("Error in getSystemMetrics:", error);
    throw error;
  }
};
module.exports = mongoose.model("Analytics", AnalyticsSchema);
