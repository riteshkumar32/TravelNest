// utils/ExpressError.js
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(); // call parent constructor (Error)
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
