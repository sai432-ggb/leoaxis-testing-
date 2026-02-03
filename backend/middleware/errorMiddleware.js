// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set default status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);

  // Different error responses for development vs production
  const response = {
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.json(response);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
