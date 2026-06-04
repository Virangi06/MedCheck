// backend/controllers/medicineController.js

const UserProfile = require('../models/UserProfile');
const { checkInteractions } = require('../utils/medicineChecker');
const { callGroqWithFallback } = require('../utils/groqHelper');

/**
 * Helper to call Groq AI to check interactions
 */
const checkInteractionsWithAi = async (medicines) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const prompt = `
Analyze potential drug-to-drug interactions, side effects, contraindications, and precautions for the following list of medications: ${medicines.join(', ')}.

Provide a structured, professional medical JSON response containing:
1. "interactionsFound": integer, the number of distinct interaction warning items.
2. "confidenceScore": an integer percentage between 50 and 100 representing the clinical confidence of this analysis.
3. "overallSeverity": one of the following exact strings: "Low Risk", "Moderate Risk", "High Risk", "Critical Risk". (Choose Low Risk if medications are generally safe, Moderate Risk for mild concerns, High Risk for standard warning risks, and Critical Risk for potentially life-threatening combinations).
4. "interactions": a JSON array of objects representing specific warnings. Each object must have:
   - "medicationA": String, the first medication name (or "General" if single medicine analysis)
   - "medicationB": String, the second medication name (or "None" if single medicine analysis)
   - "severity": one of: "Low Risk", "Moderate Risk", "High Risk", "Critical Risk"
   - "description": String, clear clinical description of the issue or guidance
   - "sideEffects": JSON array of strings, common side effects of this combination or single medication
   - "contraindications": JSON array of strings, conditions or circumstances where this combination should be avoided
   - "precautions": JSON array of strings, actionable steps the patient should take to stay safe
5. "generalAdvice": String, a general clinical recommendation summary for the patient.

Return ONLY valid JSON. Absolutely no markdown fences, no backticks, no text before or after the JSON.
`;

  try {
    const cleanedText = await callGroqWithFallback({
      messages: [
        {
          role: 'system',
          content: 'You are a professional medical AI pharmacist. You always return ONLY valid raw JSON objects.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Groq AI Medicine Check failed:', err.message);
    throw err;
  }
};

/**
 * Check interactions for a set of medicines, optionally including user's current medicines
 * POST /api/medicine/check
 */
exports.checkMedicineInteractions = async (req, res) => {
  try {
    const { medicines, checkAgainstProfile } = req.body;
    let listToCheck = [...(medicines || [])];

    if (checkAgainstProfile && req.user) {
      const profile = await UserProfile.findOne({ user: req.user.id });
      if (profile && profile.medications && profile.medications !== 'None') {
        const profileMeds = profile.medications
          .split(',')
          .map(m => m.trim())
          .filter(m => m.length > 0 && m.toLowerCase() !== 'none');
        
        listToCheck = [...listToCheck, ...profileMeds];
      }
    }

    const uniqueMeds = [...new Set(listToCheck.map(m => m.trim()))];

    if (uniqueMeds.length === 0) {
      return res.status(200).json({
        success: true,
        medicinesChecked: [],
        interactionsFound: 0,
        confidenceScore: 100,
        overallSeverity: 'Low Risk',
        interactions: [],
        generalAdvice: 'No medications provided to check.'
      });
    }

    try {
      // 1. Attempt AI analysis via Groq
      const aiResult = await checkInteractionsWithAi(uniqueMeds);
      return res.status(200).json({
        success: true,
        medicinesChecked: uniqueMeds,
        ...aiResult
      });
    } catch (aiErr) {
      console.warn('AI Interaction check failed, falling back to database local check:', aiErr.message);
      
      // 2. Fallback to local static database matching
      const localInteractions = checkInteractions(uniqueMeds);
      
      let overallSeverity = 'Low Risk';
      if (localInteractions.some(i => i.severity === 'Dangerous')) {
        overallSeverity = 'Critical Risk';
      } else if (localInteractions.some(i => i.severity === 'Warning')) {
        overallSeverity = 'High Risk';
      }

      const formattedInteractions = localInteractions.map(i => ({
        medicationA: i.medicationA,
        medicationB: i.medicationB,
        severity: i.severity === 'Dangerous' ? 'Critical Risk' : 'High Risk',
        description: i.description,
        sideEffects: ['Increased risk of bleeding', 'Stomach irritation'],
        contraindications: ['Avoid concurrent use without close medical supervision'],
        precautions: [i.alternatives || 'Consult your prescribing doctor for an alternative medication.']
      }));

      return res.status(200).json({
        success: true,
        medicinesChecked: uniqueMeds,
        interactionsFound: localInteractions.length,
        confidenceScore: 75, // Static DB confidence
        overallSeverity,
        interactions: formattedInteractions,
        generalAdvice: 'Analysis resolved using MedCheck local interaction database. Please consult a doctor.'
      });
    }

  } catch (error) {
    console.error('Medicine check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check medicine interactions',
      error: error.message
    });
  }
};

/**
 * Get current profile medications for easy reference
 * GET /api/medicine/my-medications
 */
exports.getMyMedications = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });
    const medications = [];

    if (profile && profile.medications && profile.medications !== 'None') {
      profile.medications
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0 && m.toLowerCase() !== 'none')
        .forEach(m => medications.push(m));
    }

    res.status(200).json({
      success: true,
      medications
    });
  } catch (error) {
    console.error('Get my medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile medications'
    });
  }
};

/**
 * Look up comprehensive information about a single medicine
 * POST /api/medicine/lookup
 */
exports.lookupMedicineInfo = async (req, res) => {
  try {
    const { medicineName, details } = req.body;

    if (!medicineName || !medicineName.trim()) {
      return res.status(400).json({ success: false, message: 'Medicine name is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not defined');
    }

    const detailsContext = details ? ` Additional patient context: ${details}` : '';

    const prompt = `
You are a medical information specialist. Provide a comprehensive, detailed, and easy-to-understand medicine guide for: "${medicineName.trim()}".${detailsContext}

Return ONLY a valid raw JSON object (no markdown, no backticks, no extra text) with exactly these fields:

{
  "name": "Official medicine name",
  "genericName": "Generic/chemical name if different",
  "category": "Drug category/class (e.g., NSAID, Antibiotic, Beta-blocker)",
  "overview": "2-3 sentence plain-language overview of what this medicine is and how it works",
  "howItWorks": "Brief explanation of the mechanism of action in simple terms",
  "usedFor": ["condition/situation 1", "condition/situation 2", ...],
  "dosageInfo": "General dosage information (typical adult dose, frequency, available forms)",
  "whenToTake": "Instructions on when/how to take (with food, time of day, etc.)",
  "benefits": ["benefit/pro 1", "benefit/pro 2", ...],
  "commonSideEffects": ["mild side effect 1", "mild side effect 2", ...],
  "seriousSideEffects": ["serious side effect 1", "serious side effect 2", ...],
  "contraindications": ["do not use if 1", "do not use if 2", ...],
  "precautions": ["important precaution 1", "important precaution 2", ...],
  "drugInteractionWarnings": "Brief note about important drug classes to avoid combining with",
  "storage": "How to store this medicine",
  "overdoseInfo": "Brief what to do in case of overdose",
  "confidenceScore": integer between 70 and 98
}

All array fields must have at least 3 items. All string fields must be non-empty. Return ONLY valid JSON.
`;

    const cleaned = await callGroqWithFallback({
      messages: [
        { role: 'system', content: 'You are a medical information specialist. Always return ONLY valid raw JSON objects with no markdown, no backticks, no explanation.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const data = JSON.parse(cleaned);

    return res.status(200).json({ success: true, medicine: data });
  } catch (error) {
    console.error('Medicine lookup error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to look up medicine information', error: error.message });
  }
};
