const AppError = require('../utils/appError');

/**
 * Global error handler middleware
 * Catches all errors thrown during request processing and returns proper JSON responses
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging
  console.error(`[ERROR] ${err.status} - ${err.statusCode}: ${err.message}`);

  // Operational errors (expected errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Programming or unknown errors (unexpected)
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
    statusCode: 500,
  });
};

module.exports = errorHandler;
