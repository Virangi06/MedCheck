// backend/utils/groqHelper.js
// Handles centralized Groq API calls with automatic model fallback to prevent rate limit (429) failures.

/**
 * Executes a chat completion request to Groq with fallback model support.
 * @param {Object} options Configuration options
 * @param {Array} options.messages Messages array for chat completions
 * @param {number} [options.temperature=0.2] Temperature setting
 * @param {number} [options.max_tokens=1500] Maximum tokens
 * @param {string} [options.primaryModel='llama-3.3-70b-versatile'] Primary model to try
 * @param {string} [options.fallbackModel='llama-3.1-8b-instant'] Fallback model to try in case of 429 or other errors
 * @returns {Promise<string>} The cleaned content response from Groq
 */
const callGroqWithFallback = async (options) => {
  const {
    messages,
    temperature = 0.2,
    max_tokens = 1500,
    primaryModel = 'llama-3.3-70b-versatile',
    fallbackModel = 'llama-3.1-8b-instant'
  } = options;

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  const makeRequest = async (model) => {
    console.log(`🤖 [Groq API] Attempting request using model: ${model}`);
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API Error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Empty response from Groq API');
    }
    return text;
  };

  try {
    // Try primary model
    const text = await makeRequest(primaryModel);
    // Return cleaned text
    return text.trim().replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (err) {
    console.warn(`⚠️ [Groq API Warning] Primary model (${primaryModel}) failed: ${err.message}. Trying fallback model (${fallbackModel})...`);
    try {
      // Try fallback model
      const text = await makeRequest(fallbackModel);
      // Return cleaned text
      return text.trim().replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (fallbackErr) {
      console.error(`❌ [Groq API Error] Fallback model (${fallbackModel}) also failed: ${fallbackErr.message}`);
      throw new Error(`Groq AI request failed. Both ${primaryModel} and ${fallbackModel} failed. Error: ${fallbackErr.message}`);
    }
  }
};

module.exports = {
  callGroqWithFallback
};
