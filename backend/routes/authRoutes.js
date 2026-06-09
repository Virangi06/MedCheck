const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  googleLogin,
} = require('../controllers/authController');

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  validateBody,
} = require('../middleware/validationMiddleware');

// Configure rate limiter for auth routes (max 10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication or OTP requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

// Register User
router.post(
  '/register',
  authLimiter,
  validateBody('register'),
  register
);

// Login User
router.post(
  '/login',
  authLimiter,
  validateBody('login'),
  login
);

// Google Login
router.post(
  '/google-login',
  authLimiter,
  googleLogin
);

// Logout User
router.post(
  '/logout',
  logout
);

// Forgot Password - Send OTP
router.post(
  '/forgot-password',
  authLimiter,
  validateBody('forgotPassword'),
  forgotPassword
);

// Verify OTP
router.post(
  '/verify-otp',
  authLimiter,
  validateBody('verifyOtp'),
  verifyOtp
);

// Reset Password
router.post(
  '/reset-password',
  authLimiter,
  validateBody('resetPassword'),
  resetPassword
);

// ─────────────────────────────────────────────
// PROTECTED ROUTES
// ─────────────────────────────────────────────

// Get Current Logged-in User
router.get(
  '/me',
  protect,
  getMe
);

// Change Password
router.post(
  '/change-password',
  protect,
  changePassword
);

module.exports = router;