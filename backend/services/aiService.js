const {
  GoogleGenerativeAI,
} = require('@google/generative-ai');

const analyzeAI = async (data) => {
  try {

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY missing in .env'
      );
    }

    const genAI =
      new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );

    // WORKING MODEL
    const model =
      genAI.getGenerativeModel({
        model: 'gemini-pro',
      });

    const prompt = `
You are an advanced medical AI assistant.

Analyze the symptoms professionally.

Patient Details:

Age: ${data.age}
Gender: ${data.gender}

Symptoms:
${data.symptoms}

Duration:
${data.duration}

Severity:
${data.severity}

Affected Body Area:
${data.bodyArea}

Existing Diseases:
${data.diseases}

Current Medications:
${data.medications}

Allergies:
${data.allergies}

Return ONLY JSON.

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
  "whenToSeeDoctor": "",
  "nearbyDoctorSuggestion": ""
}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const text =
      response.text();

    return text;

  } catch (error) {

    console.log('❌ AI SERVICE ERROR:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    throw error;
  }
};

module.exports = analyzeAI;