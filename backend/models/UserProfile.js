const mongoose = require('mongoose');

// Stores the user's permanent health profile (Step 1 data).
// Created on first analysis submission, updated only on explicit edit.

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one profile per user
    },

    // ── Personal Info ────────────────────────────
    fullName:    { type: String, trim: true },
    age:         { type: String },
    gender:      { type: String },
    height:      { type: String },
    weight:      { type: String },

    // ── Medical History ──────────────────────────
    diseases:    { type: String, default: 'None' },
    medications: { type: String, default: 'None' },
    allergies:   { type: String, default: 'None' },

    // ── Additional Lifestyle Metrics ──────────────
    sleepPatterns: { type: String, default: '7-8 hours, deep' },
    activityLevel: { type: String, default: 'Moderate' },
    healthGoals:   { type: String, default: 'Improve fitness' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);