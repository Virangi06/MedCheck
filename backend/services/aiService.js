// ✅ GROQ AI SERVICE
// Uses GroqCloud + Llama 3.3 70B
// Dynamic Medical AI Analysis

const { checkEmergency } = require('../utils/emergencyCheck');

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
- Use professional medical language
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

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          model:
            'llama-3.3-70b-versatile',

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

          top_p: 1,

          stream: false,
        }),
      }
    );

    /* =====================================================
       HANDLE API ERRORS
    ===================================================== */

    if (!response.ok) {
      const errBody =
        await response.text();

      throw new Error(
        `Groq API Error ${response.status}: ${errBody}`
      );
    }

    /* =====================================================
       PARSE RESPONSE
    ===================================================== */

    const json = await response.json();

    const text =
      json?.choices?.[0]?.message
        ?.content;

    if (!text) {
      throw new Error(
        'Empty response from Groq AI'
      );
    }

    console.log(
      '✅ RAW GROQ RESPONSE:',
      text
    );

    /* =====================================================
       CLEAN JSON RESPONSE
    ===================================================== */

    let cleanedText = text.trim();

    cleanedText = cleanedText.replace(
      /```json/g,
      ''
    );

    cleanedText = cleanedText.replace(
      /```/g,
      ''
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