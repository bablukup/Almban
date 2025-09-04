const { UserPreferences } = require("../models/Message");
const sanitizer = require("../utils/sanitizer");
const logger = require("../utils/logger");

// --- Helper Functions ---
// Helper for creating consistent API responses
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// Centralized error handling for all controller functions
const handleError = (res, error, customMessage = "Operation failed") => {
  // Use the imported logger for better error tracking
  logger.error(`Preferences Controller Error: ${error.message}`, {
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  let statusCode = 500;
  let message = customMessage;

  // Specific error handling for known Mongoose errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed: " + error.message;
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "Preferences already exist for this user";
  }

  return sendResponse(res, statusCode, false, message);
};

// A constant for default preferences to ensure a single source of truth
const defaultPreferences = {
  language: "en",
  tone: "friendly",
  theme: "light",
  responseStyle: "detailed",
  timezone: "UTC",
  notificationSettings: {
    email: true,
    push: true,
    sms: false,
  },
  accessibilitySettings: {
    highContrast: false,
    fontSize: "medium",
    screenReader: false,
  },
};

// --- Controller Actions ---

/**
 * @desc Get a user's preferences, creating a default entry if none exists.
 * @route GET /api/preferences
 * @access Private
 */
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { $setOnInsert: { ...defaultPreferences, userId } }, // Only set on creation
      { upsert: true, new: true, runValidators: true } // Find and update or create
    );
    return sendResponse(res, 200, true, "Preferences retrieved successfully", preferences);
  } catch (error) {
    return handleError(res, error, "Failed to retrieve preferences");
  }
};

/**
 * @desc Create initial user preferences. Fails if preferences already exist.
 * @route POST /api/preferences
 * @access Private
 */
exports.createPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await UserPreferences.create({
      userId,
      ...defaultPreferences,
      ...req.body,
    });
    return sendResponse(res, 201, true, "Preferences created successfully", preferences);
  } catch (error) {
    return handleError(res, error, "Failed to create preferences");
  }
};

/**
 * @desc Update existing user preferences. Creates a default entry if none exists.
 * @route PUT /api/preferences
 * @access Private
 */
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { ...req.body, lastUpdated: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    return sendResponse(res, 200, true, "Preferences updated successfully", preferences);
  } catch (error) {
    return handleError(res, error, "Failed to update preferences");
  }
};

// ---------------- GET PREFERENCE ANALYTICS ----------------
exports.getPreferenceAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's current preferences
    const userPrefs = await UserPreferences.findOne({ userId });

    if (!userPrefs) {
      return sendResponse(res, 404, false, "No preferences found");
    }

    // Get aggregated data for comparison
    const analytics = await UserPreferences.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          languageStats: {
            $push: "$language",
          },
          toneStats: {
            $push: "$tone",
          },
          themeStats: {
            $push: "$theme",
          },
          responseStyleStats: {
            $push: "$responseStyle",
          },
        },
      },
    ]);

    const stats = analytics[0] || {};

    // Calculate percentages
    const calculatePercentages = (arr, userChoice) => {
      const counts = {};
      arr.forEach((item) => {
        counts[item] = (counts[item] || 0) + 1;
      });

      const total = arr.length;
      const result = {};
      Object.keys(counts).forEach((key) => {
        result[key] = {
          count: counts[key],
          percentage: ((counts[key] / total) * 100).toFixed(1),
          isUserChoice: key === userChoice,
        };
      });

      return result;
    };

    const analyticsData = {
      userPreferences: userPrefs,
      globalStats: {
        totalUsers: stats.totalUsers || 0,
        languageDistribution: calculatePercentages(stats.languageStats || [], userPrefs.language),
        toneDistribution: calculatePercentages(stats.toneStats || [], userPrefs.tone),
        themeDistribution: calculatePercentages(stats.themeStats || [], userPrefs.theme),
        responseStyleDistribution: calculatePercentages(
          stats.responseStyleStats || [],
          userPrefs.responseStyle
        ),
      },
      insights: {
        isLanguagePopular:
          (stats.languageStats || []).filter((l) => l === userPrefs.language).length >
          (stats.totalUsers || 1) * 0.3,
        isTonePopular:
          (stats.toneStats || []).filter((t) => t === userPrefs.tone).length >
          (stats.totalUsers || 1) * 0.3,
        isThemePopular:
          (stats.themeStats || []).filter((t) => t === userPrefs.theme).length >
          (stats.totalUsers || 1) * 0.3,
      },
    };

    return sendResponse(
      res,
      200,
      true,
      "Preference analytics retrieved successfully",
      analyticsData
    );
  } catch (error) {
    return handleError(res, error, "Failed to retrieve preference analytics");
  }
};
