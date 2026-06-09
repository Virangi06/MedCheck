// backend/routes/medicineRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiterMiddleware');
const medicineController = require('../controllers/medicineController');

// Secure all medicine checker routes
router.use(protect);

/**
 * POST /api/medicine/check
 * Check interactions for a list of medicines
 */
router.post('/check', aiLimiter, medicineController.checkMedicineInteractions);

/**
 * GET /api/medicine/my-medications
 * Retrieve current medications from user health profile
 */
router.get('/my-medications', medicineController.getMyMedications);

/**
 * POST /api/medicine/lookup
 * Look up full medicine info (overview, uses, pros/cons, side effects, etc.)
 */
router.post('/lookup', aiLimiter, medicineController.lookupMedicineInfo);

module.exports = router;
