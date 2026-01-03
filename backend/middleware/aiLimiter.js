const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 50, // limit each user to N requests per windowMs
  message: {
    success: false,
    message: 'Too many AI requests, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.AI_RATE_LIMIT_WINDOW) || 15 * 60 * 1000) / 1000) // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => req.user?.role === 'admin' // Admins bypass rate limit
});

module.exports = { aiLimiter };
