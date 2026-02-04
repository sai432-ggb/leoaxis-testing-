const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS for all routes

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: ' Leoaxis AI Learning Platform API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      ai: '/api/ai'
    },
    documentation: 'https://github.com/leoaxis/api-docs'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 Error Handler (must be after all routes)
app.use(notFound);

// Custom Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(` Server running in ${process.env.NODE_ENV} mode`);
  console.log(` Server URL: http://localhost:${PORT}`);
  console.log(` API Base: http://localhost:${PORT}/api`);
  console.log('═══════════════════════════════════════════════════════');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
});

module.exports = app;
