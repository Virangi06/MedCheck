const mongoose = require('mongoose');

const personalizedRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    recommendations: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, default: 'General' },
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        actionable: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Ensure one entry per user per day
personalizedRecommendationSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('PersonalizedRecommendation', personalizedRecommendationSchema);
