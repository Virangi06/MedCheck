const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    /* =====================================================
       USER
    ===================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* =====================================================
       GROUPED INPUT DATA
    ===================================================== */

    inputData: {
      fullName: String,
      age: String,
      gender: String,
      height: String,
      weight: String,
      diseases: String,
      medications: String,
      allergies: String,
      symptoms: String,
      duration: String,
      severity: String,
      bodyArea: String,
    },

    /* =====================================================
       FLAT INPUT FIELDS
    ===================================================== */

    fullName: {
      type: String,
    },

    age: {
      type: String,
    },

    gender: {
      type: String,
    },

    height: {
      type: String,
    },

    weight: {
      type: String,
    },

    diseases: {
      type: String,
    },

    medications: {
      type: String,
    },

    allergies: {
      type: String,
    },

    symptoms: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
    },

    severity: {
      type: String,
    },

    bodyArea: {
      type: String,
    },

    /* =====================================================
       LOCATION
    ===================================================== */

    location: {
      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    /* =====================================================
       FLAT AI RESULT FIELDS
    ===================================================== */

    possibleCondition: {
      type: String,
    },

    conditionExplanation: {
      type: String,
    },

    urgencyLevel: {
      type: String,
    },

    recommendedDoctor: {
      type: String,
    },

    recommendedSpecialist: {
      type: String,
    },

    precautions: [
      {
        type: String,
      },
    ],

    recommendedMedicines: [
      {
        type: String,
      },
    ],

    dietRecommendation: {
      type: String,
    },

    recoveryAdvice: {
      type: String,
    },

    emergencyWarning: {
      type: String,
    },

    whenToSeeDoctor: {
      type: String,
    },

    /* =====================================================
       GROUPED RESULT
    ===================================================== */

    result: {
      possibleCondition: {
        type: String,
      },

      conditionExplanation: {
        type: String,
      },

      urgencyLevel: {
        type: String,
      },

      recommendedDoctor: {
        type: String,
      },

      recommendedSpecialist: {
        type: String,
      },

      precautions: [
        {
          type: String,
        },
      ],

      recommendedMedicines: [
        {
          type: String,
        },
      ],

      dietRecommendation: {
        type: String,
      },

      recoveryAdvice: {
        type: String,
      },

      emergencyWarning: {
        type: String,
      },

      whenToSeeDoctor: {
        type: String,
      },

      /* =====================================================
         NEARBY DOCTORS INSIDE RESULT
      ===================================================== */

      nearbyDoctors: [
        {
          name: {
            type: String,
          },

          type: {
            type: String,
          },

          address: {
            type: String,
          },

          lat: {
            type: Number,
          },

          lng: {
            type: Number,
          },

          distance: {
            type: Number,
          },
        },
      ],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Analysis',
  analysisSchema
);