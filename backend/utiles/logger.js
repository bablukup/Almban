const winston = require("winston");
const path = require("path");

// Create logs directory
const logDir = path.join(__dirname, "../logs");
require("fs").mkdirSync(logDir, { recursive: true });

// Define custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify(
      {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...meta,
      },
      null,
      2
    );
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: customFormat,
  transports: [
    // Log file for all levels
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Export methods for easy usage
module.exports = {
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },
  // Direct access to winston logger
  logger,
};
