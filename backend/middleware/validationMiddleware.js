const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //Log validation errors
    logger.warn("Validation failed", {
      path: req.path,
      method: req.method,
      errors: errors.array(),
    });

    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
      type: error.type || "field",
    }));

    return res.status(400).json({
      success: false,
      message: "validation failed",
      timestamp: new Date().toISOString(),
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = { handleValidationError };
