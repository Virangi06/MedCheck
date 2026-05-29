const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
  updateFeedback,
  deleteFeedback,
  getRandomFeedbacks,
} = require('../controllers/feedbackController');
const { protect: authenticate } = require('../middleware/authMiddleware');

// Create feedback (requires authentication)
router.post('/create', authenticate, createFeedback);

// Get all approved feedbacks (public)
router.get('/all', getAllFeedbacks);

// Get user's feedbacks (requires authentication)
router.get('/my-feedbacks', authenticate, getUserFeedbacks);

// Update feedback (requires authentication)
router.put('/update/:id', authenticate, updateFeedback);

// Delete feedback (requires authentication)
router.delete('/delete/:id', authenticate, deleteFeedback);

// Get random feedbacks for homepage (public)
router.get('/random/:limit', getRandomFeedbacks);

module.exports = router;