const rateLimit = require('express-rate-limit');

// Rate limiter for AI-intensive routes (Groq API endpoints)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 requests per hour
  message: {
    success: false,
    message: 'Hourly AI analysis request limit reached. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  aiLimiter
};
