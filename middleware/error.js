const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {  
  let error = {
    ...err
  }
  
  error.message = err.message;

  // Log this message for dev
  console.log(err);

  // Mongoose error ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.keys(err.errors).map(key => {
      return {
        [key] : err.errors[key].message
      }
    });
    error = new ErrorResponse(message, 400);
  }


  res.status(error.statusCode || 500).json({
    status: false,
    error: error.message || 'Server error'
  })
}

module.exports = errorHandler;