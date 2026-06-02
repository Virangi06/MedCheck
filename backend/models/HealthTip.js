// backend/models/HealthTip.js

const mongoose = require('mongoose');

const HealthTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    conditions: [
      {
        type: String,
        trim: true
      }
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    sharesCount: {
      type: Number,
      default: 0
    },
    isAiGenerated: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthTip', HealthTipSchema);
