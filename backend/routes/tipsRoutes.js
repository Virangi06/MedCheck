const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiterMiddleware');
const tipsController = require('../controllers/tipsController');

// All tips routes require authentication
router.use(protect);

/**
 * GET /api/tips
 * Get personalized daily health tips feed
 */
router.get('/', aiLimiter, tipsController.getHealthTips);

/**
 * PATCH /api/tips/recommendations/:id/toggle
 * Toggle completion of a daily recommendation checklist item
 */
router.patch('/recommendations/:id/toggle', tipsController.toggleRecommendationCompletion);

module.exports = router;
