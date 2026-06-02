// backend/models/StatisticsCache.js
// Copy this file to your backend/models directory

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statisticsCacheSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Basic statistics
  totalAnalyses: {
    type: Number,
    default: 0
  },

  // Symptom frequency data (top 10)
  symptomFrequency: [{
    symptom: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  }],

  // Urgency distribution
  urgencyStats: {
    low: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    emergency: { type: Number, default: 0 }
  },

  // Most common conditions (top 8)
  mostCommonConditions: [{
    condition: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    lastDetected: {
      type: Date,
      required: true
    }
  }],

  // Monthly trends
  monthlyData: [{
    month: {
      type: String, // Format: "2024-01"
      required: true
    },
    analysisCount: {
      type: Number,
      required: true
    },
    averageUrgency: {
      type: Number,
      required: true
    },
    highUrgencyCount: {
      type: Number,
      default: 0
    }
  }],

  // Health insights
  insights: {
    totalAnalyses: { type: Number, default: 0 },
    averageUrgencyLevel: { type: String, default: 'N/A' },
    riskLevel: { type: String, default: 'N/A' },
    mostRecentAnalysis: { type: Date },
    topCondition: { type: String, default: 'N/A' },
    recommendedAction: { type: String, default: '' },
    trend: { type: String, default: 'Stable' },
    calculatedAt: { type: Date }
  },

  // Cache management
  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Cache expires after 24 hours
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  }
});

// Indexes for performance
statisticsCacheSchema.index({ userId: 1, expiresAt: 1 });
statisticsCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('StatisticsCache', statisticsCacheSchema);