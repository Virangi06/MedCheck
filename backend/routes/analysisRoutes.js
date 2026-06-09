const express = require('express');

const router = express.Router();

const {
  analyzeSymptoms,
  getHistory,         
} = require('../controllers/analysisController');

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  aiLimiter,
} = require('../middleware/rateLimiterMiddleware');

/*
|--------------------------------------------------------------------------
| AI Symptom Analysis Route
|--------------------------------------------------------------------------
| Protected Route based on the token itself, no need to pass userId in body
| User must be logged in
|--------------------------------------------------------------------------
*/

router.post(
  '/analyze',
  protect,
  aiLimiter,
  analyzeSymptoms
);


router.get(
  '/history',
  protect,
  getHistory
);

module.exports = router;