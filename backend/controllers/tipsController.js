// backend/controllers/tipsController.js

const HealthTip = require('../models/HealthTip');
const UserProfile = require('../models/UserProfile');
const Analysis = require('../models/Analysis');
const PersonalizedRecommendation = require('../models/PersonalizedRecommendation');
const { callGroqWithFallback } = require('../utils/groqHelper');

// Fallback recommendations if AI fails
const fallbackRecommendations = [
  {
    title: 'Focus on Hydration & Cardiovascular Flow',
    content: 'Ensure you consume at least 8-10 glasses of water daily. Proper hydration supports cardiovascular performance and helps lower heart rate.',
    category: 'Hydration',
    priority: 'High',
    actionable: 'Drink 2 full glasses of water before breakfast and lunch.'
  },
  {
    title: 'Gentle Joint Mobility Practice',
    content: 'Engage in low-impact activity like walking or stretching. Keeping joints flexible prevents strain and strengthens stabilizing muscles.',
    category: 'Activity',
    priority: 'Medium',
    actionable: 'Complete 10 minutes of full-body stretching today.'
  },
  {
    title: 'Consistency in Sleep Rhythms',
    content: 'Aim for a consistent bedtime to regulate circadian rhythms and improve overall immune and physical recovery.',
    category: 'Sleep',
    priority: 'Medium',
    actionable: 'Turn off screens 30 minutes before sleeping.'
  }
];

/**
 * Call Groq AI to generate personalized recommendations
 */
const generatePersonalizedTipsWithGroq = async (profile, recentAnalyses, bmi) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const age = profile.age || 'Unknown';
  const gender = profile.gender || 'Unknown';
  const diseases = profile.diseases || 'None';
  const medications = profile.medications || 'None';
  const allergies = profile.allergies || 'None';
  const sleep = profile.sleepPatterns || 'Not recorded';
  const activity = profile.activityLevel || 'Not recorded';
  const goals = profile.healthGoals || 'Not specified';
  const bmiVal = bmi ? `${bmi} (${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'})` : 'Not computed';
  
  const symptomsList = recentAnalyses.map(a => a.inputData?.symptoms || a.symptoms).filter(Boolean).join(', ') || 'No recent symptoms reported';

  const prompt = `
You are a professional medical AI health coach.
Create exactly 3 highly personalized, actionable daily health recommendations for a patient with these metrics:
- Age: ${age}
- Gender: ${gender}
- Existing Conditions: ${diseases}
- Current Medications: ${medications}
- Allergies: ${allergies}
- BMI: ${bmiVal}
- Sleep Patterns: ${sleep}
- Activity Level: ${activity}
- Health Goals: ${goals}
- Recent Reported Symptoms: ${symptomsList}

Rules for tips:
1. They must be highly personalized. Do NOT write generic advice like "Drink water". Make it specific to their active parameters. Example: "Based on your recent blood pressure trends and activity levels, increasing daily water intake by 500ml may help improve hydration and cardiovascular performance."
2. Define a clear category (e.g. Cardiovascular, Hydration, Sleep, Activity, Medication).
3. Assign a priority level: "High", "Medium", or "Low". (At least one must be High).
4. Provide a single, concrete, short actionable checkbox task (under 15 words) for the user to complete today (e.g. "Do 10 minutes of light stretches after dinner").

Return ONLY a valid JSON array of objects with the exact structure (no markdown fences, no backticks, no explanations outside the JSON):
[
  {
    "title": "Tip Title",
    "content": "Personalized detailed health advice...",
    "category": "Category",
    "priority": "High",
    "actionable": "Concrete actionable checkbox task for today"
  }
]
`;

  try {
    const cleanedText = await callGroqWithFallback({
      messages: [
        {
          role: 'system',
          content: 'You are a professional medical health coach. Always return ONLY valid raw JSON array of tips.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1200,
    });

    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Groq personalized tips generation failed:', err.message);
    throw err;
  }
};

/**
 * GET /api/tips
 * Retrieve personalized daily health tips checklist (Cached daily)
 */
exports.getHealthTips = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if daily recommendations already exist
    let dailyRec = await PersonalizedRecommendation.findOne({ user: userId, date: todayStr });

    if (!dailyRec) {
      console.log('Generating fresh daily personalized health recommendations for user:', userId);
      
      const profile = await UserProfile.findOne({ user: userId }) || {
        age: '', gender: '', diseases: 'None', medications: 'None', allergies: 'None'
      };

      const recentAnalyses = await Analysis.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3);

      let bmi = null;
      if (profile.height && profile.weight) {
        const heightM = parseFloat(profile.height) / 100;
        const weightKg = parseFloat(profile.weight);
        if (heightM > 0 && weightKg > 0) {
          bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
        }
      }

      let recommendations = [];
      try {
        recommendations = await generatePersonalizedTipsWithGroq(profile, recentAnalyses, bmi);
      } catch (aiErr) {
        console.warn('AI tips generation failed, falling back to static recommendations:', aiErr.message);
        recommendations = [...fallbackRecommendations];
      }

      dailyRec = await PersonalizedRecommendation.findOneAndUpdate(
        { user: userId, date: todayStr },
        { user: userId, date: todayStr, recommendations },
        { upsert: true, new: true }
      );
    }

    const disclaimer = "MedCheck provides informational AI analysis for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.";

    res.status(200).json({
      success: true,
      date: todayStr,
      recommendations: dailyRec.recommendations,
      disclaimer
    });

  } catch (error) {
    console.error('Get health tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve personalized health tips'
    });
  }
};

/**
 * PATCH /api/tips/recommendations/:id/toggle
 * Toggle completion status of a daily actionable health goal recommendation
 */
exports.toggleRecommendationCompletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendationId = req.params.id;
    const { completed } = req.body;

    const updated = await PersonalizedRecommendation.findOneAndUpdate(
      { user: userId, 'recommendations._id': recommendationId },
      { $set: { 'recommendations.$.completed': !!completed } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal completion status updated successfully',
      recommendations: updated.recommendations
    });

  } catch (error) {
    console.error('Toggle recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recommendation status'
    });
  }
};
