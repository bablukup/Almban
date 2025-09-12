const { query } = require("express-validator");
const NodeCache = require("node-cache");
const logger = require("../utils/logger");
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // 5 minutes default

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    try {
      // Create cache key based on user ID and request
      const key = `${req.user.id}:${req.originalUrl}:${JSON.stringify(req, query)}`;
      const cachedResponse = cache.get(key);

      if (cachedResponse) {
        return res.json(cachedResponse);
      }
      // Store original res.json
      const originalJson = res.json;

      // Override res.json to cache the response
      res.json = function (data) {
        try {
          // Only cache successful responses
          if (data && data.success !== false) {
            cache.set(key, data, duration);
          }
          // Call original res.json
          return originalJson.call(this, data);
        } catch (error) {
          logger.error("Cache set error:", error);
          return originalJson.call(this, data);
        }
      };
      next();
    } catch (error) {
      logger.error("Cache middleware error:", error);
      next(error);
    }
  };
};

module.exports = { cache: cacheMiddleware };
