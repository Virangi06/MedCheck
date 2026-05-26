const express = require('express');

const router = express.Router();

const {
  analyzeSymptoms,
} = require('../controllers/analysisController');

const {
  protect,
} = require('../middleware/authMiddleware');

/*
|--------------------------------------------------------------------------
| AI Symptom Analysis Route
|--------------------------------------------------------------------------
| Protected Route
| User must be logged in
|--------------------------------------------------------------------------
*/

router.post(
  '/analyze',
  protect,
  analyzeSymptoms
);

module.exports = router;