// ============================================
// error.middleware.js - Global Error Handling
// ============================================

// Middleware function (Express.js: Middleware)
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`, // Template literal (JS Essentials: Template Literals)
  });
};

// Global error handler (Express.js: Error Handling)
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
  });
};
