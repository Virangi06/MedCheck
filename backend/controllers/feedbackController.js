const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Create Feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, feedbackText, role } = req.body;
    const userId = req.user.id || req.user._id;

    // Validate input
    if (!rating || !feedbackText) {
      return res.status(400).json({ 
        message: 'Rating and feedback text are required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    if (feedbackText.length < 10 || feedbackText.length > 500) {
      return res.status(400).json({ 
        message: 'Feedback must be between 10 and 500 characters' 
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create feedback
    const feedback = new Feedback({
      userId,
      userName: user.name || user.email || 'Anonymous',
      role: role || 'Patient',
      rating,
      feedbackText,
      isVerified: user.isDoctor || false, // Check if user is doctor
      isApproved: true, // Auto-approve (can be set to false for manual review)
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ 
      message: 'Error creating feedback',
      error: error.message 
    });
  }
};

// Get All Approved Feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ 
      message: 'Error fetching feedbacks',
      error: error.message 
    });
  }
};

// Get User's Feedbacks
const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const feedbacks = await Feedback.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching user feedbacks:', error);
    res.status(500).json({ 
      message: 'Error fetching user feedbacks',
      error: error.message 
    });
  }
};

// Update Feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedbackText, role } = req.body;
    const userId = req.user.id || req.user._id;

    // Check if feedback belongs to user
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this feedback' 
      });
    }

    // Update fields
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      feedback.rating = rating;
    }

    if (feedbackText) {
      if (feedbackText.length < 10 || feedbackText.length > 500) {
        return res.status(400).json({ message: 'Feedback must be between 10 and 500 characters' });
      }
      feedback.feedbackText = feedbackText;
    }

    if (role) feedback.role = role;
    feedback.updatedAt = Date.now();

    const updatedFeedback = await feedback.save();

    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      message: 'Error updating feedback',
      error: error.message 
    });
  }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // Check if feedback belongs to user
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this feedback' 
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ 
      message: 'Error deleting feedback',
      error: error.message 
    });
  }
};

// Get Random Feedbacks (for homepage display)
const getRandomFeedbacks = async (req, res) => {
  try {
    const { limit } = req.params;
    const numLimit = parseInt(limit) || 3;

    // Get random feedbacks using $sample aggregation
    const feedbacks = await Feedback.aggregate([
      { $match: { isApproved: true } },
      { $sample: { size: Math.min(numLimit, 10) } }, // Limit to 10 max
      { $sort: { rating: -1, createdAt: -1 } },
    ]);

    res.status(200).json({
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching random feedbacks:', error);
    
    // Fallback: Get recent feedbacks if aggregation fails
    try {
      const { limit } = req.params;
      const numLimit = parseInt(limit) || 3;
      
      const feedbacks = await Feedback.find({ isApproved: true })
        .sort({ createdAt: -1 })
        .limit(numLimit);

      res.status(200).json({
        count: feedbacks.length,
        feedbacks,
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        message: 'Error fetching feedbacks',
        error: error.message 
      });
    }
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
  updateFeedback,
  deleteFeedback,
  getRandomFeedbacks,
};