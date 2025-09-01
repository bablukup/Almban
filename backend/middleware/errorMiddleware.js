const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      timestamp: new Date().toISOString(),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired",
      timestamp: new Date().toISOString(),
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
