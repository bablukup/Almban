const validator = require("validator");
const logger = require("./logger");

/**
 * Sanitizes text input by removing dangerous content
 * @param {string} text - Input text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeText = (text) => {
  try {
    if (!text || typeof text !== "string") return "";

    // Remove potentially dangerous HTML/JS with improved regex
    let sanitized = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    // Escape HTML entities
    sanitized = validator.escape(sanitized);

    // Decode specific safe entities for readability
    sanitized = sanitized
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return sanitized.trim();
  } catch (error) {
    logger.error("Sanitization error:", error);
    return "";
  }
};

/**
 * Sanitizes object fields based on allowed fields list
 * @param {Object} obj - Object to sanitize
 * @param {string[]} allowedFields - List of allowed field names
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj, allowedFields) => {
  try {
    if (!obj || typeof obj !== "object") return {};
    if (!Array.isArray(allowedFields)) return {};

    const sanitized = {};

    allowedFields.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "string") {
          sanitized[key] = sanitizeText(obj[key]);
        } else if (Array.isArray(obj[key])) {
          sanitized[key] = obj[key].map((item) =>
            typeof item === "string" ? sanitizeText(item) : item
          );
        } else {
          sanitized[key] = obj[key];
        }
      }
    });

    return sanitized;
  } catch (error) {
    logger.error("Object sanitization error:", error);
    return {};
  }
};

module.exports = {
  sanitizeText,
  sanitizeObject,
};
