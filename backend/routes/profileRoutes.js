const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getOrCreateProfile,
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
// PROTECTED ROUTES
// ─────────────────────────────────────────────

// Get profile (on dashboard load)
router.get('/', protect, getProfile);

// Get or create profile (on app initialization)
router.get('/init', protect, getOrCreateProfile);

// Update profile
router.put('/', protect, updateProfile);

module.exports = router;