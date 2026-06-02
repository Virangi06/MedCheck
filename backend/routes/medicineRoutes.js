// backend/routes/medicineRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const medicineController = require('../controllers/medicineController');

// Secure all medicine checker routes
router.use(protect);

/**
 * POST /api/medicine/check
 * Check interactions for a list of medicines
 */
router.post('/check', medicineController.checkMedicineInteractions);

/**
 * GET /api/medicine/my-medications
 * Retrieve current medications from user health profile
 */
router.get('/my-medications', medicineController.getMyMedications);

module.exports = router;
