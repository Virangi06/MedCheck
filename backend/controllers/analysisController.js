const analyzeAI = require('../services/aiService');

exports.analyzeSymptoms = async (req, res) => {
  try {

    const result = await analyzeAI(req.body);

    let cleanedResult = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    console.log('✅ AI Analysis Result:', cleanedResult);

    const parsedResult = JSON.parse(cleanedResult);

    res.status(200).json({
      success: true,
      analysis: parsedResult,
    });

  } catch (error) {

    console.error('❌ AI ERROR:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    let errorMessage = 'AI analysis failed';
    let statusCode = 500;

    // Gemini API Key Error
    if (error.message.includes('GEMINI_API_KEY')) {
      errorMessage =
        'Gemini API key is not configured.';
      statusCode = 503;
    }

    // Gemini API Error
    else if (error.message.includes('API')) {
      errorMessage =
        'Gemini API error. Please check your API key.';
      statusCode = 503;
    }

    // JSON Parse Error
    else if (error instanceof SyntaxError) {
      errorMessage =
        'Failed to parse AI response.';
      statusCode = 502;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    });
  }
};