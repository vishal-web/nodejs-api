const errorHandler = (err, req, res, next) => {
  // Log this message for dev
  console.log(err.stack.red);

  res.status(500).json({
    status: false,
    error: err.message 
  })
}

module.exports = errorHandler;