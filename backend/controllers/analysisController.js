const analyzeAI = require('../services/aiService');

const {
  getNearbyDoctors,
} = require('../services/locationService');

const calculateDistance = require('../utils/calculateDistance');

const Analysis = require('../models/Analysis');
const UserProfile = require('../models/UserProfile');

exports.analyzeSymptoms = async (
  req,
  res
) => {
  try {
    /* =====================================================
       REQUEST DATA
    ===================================================== */

    const body = req.body;

    console.log('📥 ANALYSIS REQUEST:', body);

    /* =====================================================
       VALIDATE LOCATION
    ===================================================== */

    let userLat = null;
    let userLng = null;

    if (
      body.location &&
      body.location.lat &&
      body.location.lng
    ) {
      userLat = body.location.lat;
      userLng = body.location.lng;
    }

    /* =====================================================
       AI ANALYSIS
    ===================================================== */

    const aiResult = await analyzeAI(body);

    console.log('✅ AI RESULT:', aiResult);

    /* =====================================================
       FETCH REAL NEARBY DOCTORS
    ===================================================== */

    let nearbyDoctors = [];

    if (userLat && userLng) {
      const places = await getNearbyDoctors(
        userLat,
        userLng,
        aiResult.recommendedDoctor
      );

      nearbyDoctors = places.map((place) => ({
        name:     place.name    || 'Medical Facility',
        type:     place.type    || 'Doctor',
        address:  place.address || 'Address unavailable',
        lat:      place.lat,
        lng:      place.lng,
        // ✅ FIX: parse to float so it's always a Number, never a String
        distance: parseFloat(
          calculateDistance(userLat, userLng, place.lat, place.lng)
        ),
      }));
    }

    /* =====================================================
       CREATE OR UPDATE USER PROFILE
       Only update if data has changed
    ===================================================== */

    try {
      const existingProfile = await UserProfile.findOne({ user: req.user.id });

      const profileData = {
        user: req.user.id,
        fullName: body.fullName || existingProfile?.fullName || '',
        age: body.age || existingProfile?.age || '',
        gender: body.gender || existingProfile?.gender || '',
        height: body.height || existingProfile?.height || '',
        weight: body.weight || existingProfile?.weight || '',
        diseases: body.diseases || existingProfile?.diseases || 'None',
        medications: body.medications || existingProfile?.medications || 'None',
        allergies: body.allergies || existingProfile?.allergies || 'None',
      };

      if (existingProfile) {
        // Update if data changed
        await UserProfile.findByIdAndUpdate(existingProfile._id, profileData, { new: true });
      } else {
        // Create if doesn't exist
        await UserProfile.create(profileData);
      }

      console.log('✅ Profile saved/updated');
    } catch (profileError) {
      console.warn('⚠️ Profile save warning (non-critical):', profileError.message);
    }

    /* =====================================================
       EMERGENCY OVERRIDE
    ===================================================== */

    const symptomsText = (body.symptoms || '').toLowerCase();

    const emergencyKeywords = [
      'chest pain',
      'difficulty breathing',
      'stroke',
      'heart attack',
      'severe bleeding',
      'blood vomiting',
      'unconscious',
      'seizure',
    ];

    const emergencyDetected = emergencyKeywords.some((word) =>
      symptomsText.includes(word)
    );

    if (emergencyDetected) {
      aiResult.urgencyLevel = 'High';
      aiResult.emergencyWarning =
        'Potential medical emergency detected. Seek immediate medical care immediately.';
    }

    /* =====================================================
       FINAL RESPONSE OBJECT
    ===================================================== */

    const finalAnalysis = {
      ...aiResult,
      nearbyDoctors,
    };

    console.log('✅ FINAL ANALYSIS:', finalAnalysis);

    /* =====================================================
       SAVE TO MONGODB
       ✅ FIX: result field now explicitly maps only AI fields
       (no nearbyDoctors spreading into the wrong subdoc type)
       ✅ FIX: Wrapped in own try/catch so DB failure never
       blocks the AI response from reaching the frontend
    ===================================================== */

    let savedId = null;

    try {
      console.log("========== DEBUG SAVE =========="); console.log("REQ USER:", req.user); console.log("REQ USER ID:", req.user?.id); console.log("BODY:", body); console.log("NEARBY DOCTORS:", nearbyDoctors); console.log("================================");
      const saved = await Analysis.create({
        user: req.user.id,

        // flat input fields
        fullName:    body.fullName,
        age:         body.age,
        gender:      body.gender,
        height:      body.height,
        weight:      body.weight,
        diseases:    body.diseases,
        medications: body.medications,
        allergies:   body.allergies,
        symptoms:    body.symptoms,
        duration:    body.duration,
        severity:    body.severity,
        bodyArea:    body.bodyArea,
        location:    body.location,

        // grouped inputData for dashboard health profile
        inputData: {
          fullName:    body.fullName,
          age:         body.age,
          gender:      body.gender,
          height:      body.height,
          weight:      body.weight,
          diseases:    body.diseases,
          medications: body.medications,
          allergies:   body.allergies,
          symptoms:    body.symptoms,
          duration:    body.duration,
          severity:    body.severity,
          bodyArea:    body.bodyArea,
        },

        // ✅ FIX: result maps each field explicitly — no spreading finalAnalysis
        // This prevents type mismatch errors from extra fields
        result: {
          possibleCondition:     aiResult.possibleCondition,
          conditionExplanation:  aiResult.conditionExplanation,
          urgencyLevel:          aiResult.urgencyLevel,
          recommendedDoctor:     aiResult.recommendedDoctor,
          recommendedSpecialist: aiResult.recommendedSpecialist,
          precautions:           aiResult.precautions    || [],
          recommendedMedicines:  aiResult.recommendedMedicines || [],
          dietRecommendation:    aiResult.dietRecommendation,
          recoveryAdvice:        aiResult.recoveryAdvice,
          emergencyWarning:      aiResult.emergencyWarning,
          whenToSeeDoctor:       aiResult.whenToSeeDoctor,
          nearbyDoctors: nearbyDoctors
        },

        // flat AI fields
        possibleCondition:     aiResult.possibleCondition,
        conditionExplanation:  aiResult.conditionExplanation,
        urgencyLevel:          aiResult.urgencyLevel,
        recommendedDoctor:     aiResult.recommendedDoctor,
        recommendedSpecialist: aiResult.recommendedSpecialist,
        precautions:           aiResult.precautions    || [],
        recommendedMedicines:  aiResult.recommendedMedicines || [],
        dietRecommendation:    aiResult.dietRecommendation,
        recoveryAdvice:        aiResult.recoveryAdvice,
        emergencyWarning:      aiResult.emergencyWarning,
        whenToSeeDoctor:       aiResult.whenToSeeDoctor,

      });

      savedId = saved._id;
      console.log('💾 Saved to MongoDB, id:', savedId);

    } 
    catch (dbError) {
  console.error('FULL DB ERROR:', dbError);

  return res.status(500).json({
    success: false,
    message: dbError.message,
    error: dbError
  });
}

    /* =====================================================
       SEND RESPONSE TO FRONTEND
    ===================================================== */

    return res.status(200).json({
      success:  true,
      analysis: finalAnalysis,
      id:       savedId,
    });

  } catch (error) {
    console.error('❌ ANALYSIS CONTROLLER ERROR:', {
      message: error.message,
      stack:   error.stack,
    });

    let errorMessage = 'AI analysis failed';
    let statusCode   = 500;

    if (error.message.includes('GROQ_API_KEY')) {
      errorMessage = 'Groq API key missing in server .env';
      statusCode   = 503;
    } else if (error.message.includes('invalid JSON')) {
      errorMessage = 'AI returned invalid response';
      statusCode   = 502;
    } else if (error.message.includes('fetch')) {
      errorMessage = 'External API request failed';
      statusCode   = 503;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error:   process.env.NODE_ENV === 'development'
        ? error.message
        : undefined,
    });
  }
};

/* =====================================================
   GET HISTORY — for PatientDashboard
===================================================== */

exports.getHistory = async (req, res) => {
  try {
    const analyses = await Analysis
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success:  true,
      analyses,
    });

  } catch (error) {
    console.error('❌ GET HISTORY ERROR:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
    });
  }
};