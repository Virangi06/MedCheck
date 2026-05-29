const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['Patient', 'Doctor', 'Other'],
    default: 'Patient',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Set to true if user is a verified doctor
  },
  isApproved: {
    type: Boolean,
    default: true, // Can be set to false for manual review
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);