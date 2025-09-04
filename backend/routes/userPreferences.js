const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");

//Controllers
const preferencesController = require("../controllers/preferencesController");

//Middleware
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

// ---------------- Validation Rules ----------------
// prettier-ignore
const updatePreferencesValidation = [
  body('language')
    .optional()
    .isIn(['en', 'hi', 'es', 'fr', 'de'])
    .withMessage('Invalid language code'),
  
  body('tone')
    .optional()
    .isIn(['friendly', 'formal', 'sarcastic', 'professional', 'casual'])
    .withMessage('Invalid tone preference'),

  body('theme')
    .optional()
    .isIn(['dark', 'light', 'auto'])
    .withMessage('Invalid theme preference'),

  body('responseStyle')
    .optional()
    .isIn(['short', 'detailed', 'simple', 'complex', 'bullet_points'])
    .withMessage('Invalid response style')  ,

  body('timeZone')
    .optional()
    .isString()
    .isLength({min: 1, max:50})
    .withMessage('Invalid timezone format'),

  body('notificationSettings')
    .optional()
    .isObject()
    .withMessage('Notification settings must be an object'),
  
  body('notificationSettings.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification setting must be boolean'),
  
  body('notificationSettings.push')
    .optional()
    .isBoolean()
    .withMessage('Push notification setting must be boolean'),
  
  body('notificationSettings.sms')
    .optional()
    .isBoolean()
    .withMessage('SMS notification setting must be boolean'),
  
  body('accessibilitySettings')
    .optional()
    .isObject()
    .withMessage('Accessibility settings must be an object')  
];

// ---------------- USER PREFERENCES ROUTES ----------------

/**
 * @route   GET /api/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  cacheMiddleware.cache(600), // 10 minutes cache
  preferencesController.getPreferences
);

/**
 * @route   POST /api/preferences
 * @desc    Create initial user preferences
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  updatePreferencesValidation,
  validationMiddleware.handleValidationError,
  preferencesController.createPreferences
);

/**
 * @route   PUT /api/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put(
  "/",
  authMiddleware,
  updatePreferencesValidation,
  validationMiddleware.handleValidationError,
  preferencesController.updatePreferences
);

/**
 * @route   GET /api/preferences/defaults
 * @desc    Get default preference options
 * @access  Private
 */
router.get(
  "/defaults",
  authMiddleware,
  cacheMiddleware.cache(3600), // 1 hour cache
  preferencesController.getDefaultsOptions
);

/**
 * @route   POST /api/preferences/reset
 * @desc    Reset preferences to default
 * @access  Private
 */
router.post("/reset", authMiddleware, preferencesController.resetToDefaults);

/**
 * @route   GET /api/preferences/export
 * @desc    Export user preferences
 * @access  Private
 */
router.get("/export", authMiddleware, preferencesController.exportPreferences);

/**
 * @route   POST /api/preferences/import
 * @desc    Import user preferences
 * @access  Private
 */
router.post(
  "/import",
  authMiddleware,
  [body("preferences").isObject().withMessage("preferences data required")],
  validationMiddleware.handleValidationError,
  preferencesController.importPreferences
);

module.exports = router;
