const mongoose = require('mongoose');

const analysisSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      /* =====================================================
         GROUPED INPUT DATA (for dashboard health profile)
      ===================================================== */

      inputData: {
        fullName:    String,
        age:         String,
        gender:      String,
        height:      String,
        weight:      String,
        diseases:    String,
        medications: String,
        allergies:   String,
        symptoms:    String,
        duration:    String,
        severity:    String,
        bodyArea:    String,
      },

      /* =====================================================
         FLAT INPUT FIELDS (backward compat)
      ===================================================== */

      fullName:    { type: String },
      age:         { type: String },
      gender:      { type: String },
      height:      { type: String },
      weight:      { type: String },
      diseases:    { type: String },
      medications: { type: String },
      allergies:   { type: String },
      symptoms:    { type: String, required: true },
      duration:    { type: String },
      severity:    { type: String },
      bodyArea:    { type: String },

      location: {
        lat: Number,
        lng: Number,
      },

      /* =====================================================
         FLAT AI RESULT FIELDS (original schema)
      ===================================================== */

      possibleCondition:    { type: String },
      conditionExplanation: { type: String },
      urgencyLevel:         { type: String },
      recommendedDoctor:    { type: String },
      recommendedSpecialist:{ type: String },

      precautions:          [{ type: String }],
      recommendedMedicines: [{ type: String }],

      dietRecommendation: { type: String },
      recoveryAdvice:     { type: String },
      emergencyWarning:   { type: String },
      whenToSeeDoctor:    { type: String },

      /* =====================================================
         GROUPED RESULT (for dashboard history cards)
         ✅ FIX: Added nearbyDoctors array inside result
         ✅ FIX: nearbyDoctors.distance is Number not String
      ===================================================== */

      result: {
        possibleCondition:     String,
        conditionExplanation:  String,
        urgencyLevel:          String,
        recommendedDoctor:     String,
        recommendedSpecialist: String,
        precautions:           [String],
        recommendedMedicines:  [String],
        dietRecommendation:    String,
        recoveryAdvice:        String,
        emergencyWarning:      String,
        whenToSeeDoctor:       String,
        nearbyDoctors: [
          {
            name:     String,
            type:     String,
            address:  String,
            lat:      Number,
            lng:      Number,
            distance: Number,   // ✅ FIX: was String, must be Number
          },
        ],
      },

      /* =====================================================
         NEARBY DOCTORS (top-level)
         ✅ FIX: distance is Number not String
      ===================================================== */

      nearbyDoctors: [
        {
          name:     String,
          type:     String,
          address:  String,
          lat:      Number,
          lng:      Number,
          distance: Number,   // ✅ FIX: was String, must be Number
        },
      ],
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  'Analysis',
  analysisSchema
);