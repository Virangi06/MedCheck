// ✅ GROQ AI SERVICE
// Uses GroqCloud + Llama 3.3 70B
// Dynamic Medical AI Analysis

const { checkEmergency } = require('../utils/emergencyCheck');
const { callGroqWithFallback } = require('../utils/groqHelper');

const analyzeAI = async (data) => {
  try {
    /* =====================================================
       ENV VALIDATION
    ===================================================== */

    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY missing in .env'
      );
    }

    /* =====================================================
       SAFE MEDICAL AI PROMPT
    ===================================================== */

    const prompt = `
You are a professional AI medical assistant.

IMPORTANT RULES:
- Return ONLY valid raw JSON
- No markdown
- No backticks
- No explanations outside JSON
- Never generate fake doctor names
- Never generate fake hospitals
- Never generate fake addresses
- Never generate fake locations
- Never generate fake distances
- Never claim certainty
- Mention possible conditions only
- Use simple, common layperson language for condition names (e.g., 'Acid reflux' instead of 'Gastroesophageal reflux disease', 'Heart attack' instead of 'Myocardial infarction', 'Stomach flu' instead of 'Gastroenteritis'). Avoid complex medical jargon.
- Keep explanations concise and safe

PATIENT DETAILS:

Age: ${data.age}
Gender: ${data.gender}
Symptoms: ${data.symptoms}
Duration: ${data.duration}
Severity: ${data.severity}
Affected Body Area: ${data.bodyArea}
Existing Diseases: ${data.diseases}
Current Medications: ${data.medications}
Allergies: ${data.allergies}

RETURN THIS EXACT JSON STRUCTURE:

{
  "possibleCondition": "",
  "conditionExplanation": "",
  "urgencyLevel": "",
  "recommendedDoctor": "",
  "recommendedSpecialist": "",
  "precautions": [],
  "recommendedMedicines": [],
  "dietRecommendation": "",
  "recoveryAdvice": "",
  "emergencyWarning": "",
  "whenToSeeDoctor": ""
}
`;

    /* =====================================================
       GROQ API CALL
    ===================================================== */

    const cleanedText = await callGroqWithFallback({
      messages: [
        {
          role: 'system',
          content:
            'You are a professional medical AI assistant. Always return ONLY valid raw JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    console.log(
      '✅ RAW GROQ RESPONSE (Cleaned):',
      cleanedText
    );

    /* =====================================================
       PARSE JSON SAFELY
    ===================================================== */

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.log(
        '❌ JSON PARSE ERROR:',
        parseError.message
      );

      throw new Error(
        'AI returned invalid JSON'
      );
    }

    /* =====================================================
       SAFETY FALLBACKS
    ===================================================== */

    parsed.possibleCondition =
      parsed.possibleCondition ||
      'Unknown Condition';

    parsed.conditionExplanation =
      parsed.conditionExplanation ||
      'No explanation available';

    parsed.urgencyLevel =
      parsed.urgencyLevel || 'Moderate';

    parsed.recommendedDoctor =
      parsed.recommendedDoctor ||
      'General Physician';

    parsed.recommendedSpecialist =
      parsed.recommendedSpecialist ||
      parsed.recommendedDoctor;

    parsed.precautions =
      parsed.precautions || [];

    parsed.recommendedMedicines =
      parsed.recommendedMedicines || [];

    parsed.dietRecommendation =
      parsed.dietRecommendation ||
      'Stay hydrated and eat balanced meals';

    parsed.recoveryAdvice =
      parsed.recoveryAdvice ||
      'Get proper rest and monitor symptoms';

    parsed.emergencyWarning =
      parsed.emergencyWarning ||
      'Seek immediate medical attention if symptoms worsen';

    parsed.whenToSeeDoctor =
      parsed.whenToSeeDoctor ||
      'Consult a doctor if symptoms persist';

    /* =====================================================
       EMERGENCY KEYWORD DETECTION (WITH NEGATION CHECK)
    ===================================================== */

    if (checkEmergency(data.symptoms)) {
      parsed.urgencyLevel = 'High';

      parsed.emergencyWarning =
        'Potential medical emergency detected. Seek immediate medical attention.';
    }

    /* =====================================================
       FINAL RESPONSE
    ===================================================== */

    return parsed;
  } catch (error) {
    console.log(
      '❌ AI SERVICE ERROR:',
      {
        message: error.message,
        stack: error.stack,
      }
    );

    throw error;
  }
};

module.exports = analyzeAI;