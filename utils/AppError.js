class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the built-in Error constructor
    this.statusCode = statusCode;
    this.isOperational = true; // You can use this flag to distinguish known errors
  }
}

module.exports = AppError;

