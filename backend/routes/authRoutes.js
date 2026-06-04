const express = require('express');

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

} = require('../controllers/authController');

const {
  protect,
} = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

// Register User
router.post(
  '/register',
  register
);

// Login User
router.post(
  '/login',
  login
);

// Logout User
router.post(
  '/logout',
  logout
);

// Forgot Password - Send OTP
router.post(
  '/forgot-password',
  forgotPassword
);

// Verify OTP
router.post(
  '/verify-otp',
  verifyOtp
);

// Reset Password
router.post(
  '/reset-password',
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