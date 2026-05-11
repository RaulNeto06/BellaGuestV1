/**
 * AppError – operational (expected) error class.
 * Errors with isOperational = true are safe to expose to the client.
 * The errorMiddleware uses this flag to decide the HTTP status code and message.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
