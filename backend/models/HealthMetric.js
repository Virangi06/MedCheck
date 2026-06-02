const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema(
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
    heartRate: {
      type: Number, // bpm
    },
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number },
    },
    weight: {
      type: Number, // kg
    },
    sleepDuration: {
      type: Number, // hours
    },
    activityLevel: {
      type: Number, // steps
    },
    healthScore: {
      type: Number, // 0-100 score
    },
    bmi: {
      type: Number, // body mass index
    }
  },
  {
    timestamps: true,
  }
);

// Ensure one entry per user per day
healthMetricSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
