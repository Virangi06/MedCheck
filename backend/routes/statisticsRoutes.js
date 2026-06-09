const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiterMiddleware');
const statisticsController = require('../controllers/statisticsController');

// All statistics routes require authentication
router.use(protect);

/**
 * GET /api/statistics/dashboard
 * Get comprehensive dashboard statistics with all charts data
 * Returns: symptomFrequency, urgencyStats, conditions, monthlyTrends, insights
 */
router.get('/dashboard', statisticsController.getDashboardStatistics);

/**
 * GET /api/statistics/summary
 * Get quick summary (lightweight endpoint)
 * Returns: totalAnalyses, lastAnalysisDate, analysisThisMonth, lastSevenDays
 */
router.get('/summary', statisticsController.getStatisticsSummary);

/**
 * POST /api/statistics/clear-cache
 * Manually clear cached statistics (forces recalculation on next request)
 */
router.post('/clear-cache', statisticsController.clearStatisticsCache);

// Health Metrics logging & analytics retrieval
router.get('/metrics', statisticsController.getHealthMetrics);
router.post('/metrics', statisticsController.saveHealthMetric);

/**
 * POST /api/statistics/ai-assessment
 * Run a full Groq AI health assessment based on user analyses + profile
 */
router.post('/ai-assessment', aiLimiter, statisticsController.getAIHealthAssessment);

module.exports = router;