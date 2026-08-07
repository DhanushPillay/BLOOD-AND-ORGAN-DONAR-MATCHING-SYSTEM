const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(`[Error] ${err.message}`, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // Only mask 500 internal server errors in production. Expose 400-level client errors.
  const isServerError = statusCode >= 500;
  const message = (process.env.NODE_ENV === "production" && isServerError)
    ? "An internal server error occurred"
    : err.message;

  res.status(statusCode);
  res.json({
    message,
    stack: null,
  });
};

module.exports = { errorHandler };
