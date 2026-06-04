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

const prefixNegations = [
  'no',
  'not',
  'without',
  'never',
  'free of',
  'ruled out',
  'denies',
  'denied',
  'negative for',
  'none of'
];

const suffixNegationRegex = /^(?:\s*:\s*(?:no|none|negative|nil|false|absent)\b|(?:\s*is\s+)?(?:not\s+present|absent|not\s+detected|not\s+observed|nil)\b)/i;

/**
 * Checks if symptoms text indicates a potential medical emergency.
 * It searches for emergency keywords and ensures they are not negated
 * by preceding or succeeding negative qualifiers.
 *
 * @param {string} symptoms - The symptoms description text
 * @returns {boolean} True if an active emergency is detected
 */
const checkEmergency = (symptoms) => {
  if (!symptoms) return false;
  const text = symptoms.toLowerCase();

  for (const keyword of emergencyKeywords) {
    let index = text.indexOf(keyword);
    
    while (index !== -1) {
      // 1. Check preceding negation (prefix)
      const prefix = text.substring(Math.max(0, index - 30), index).trim();
      const prefixClauses = prefix.split(/[,.;]|\bbut\b|\band\b/i);
      const immediatePrefix = prefixClauses[prefixClauses.length - 1].trim();
      
      const isPrefixNegated = prefixNegations.some(neg => {
        const regex = new RegExp(`\\b${neg}\\b\\s*(?:[a-zA-Z]+\\s*){0,3}$`, 'i');
        return regex.test(immediatePrefix);
      });

      // 2. Check succeeding negation (suffix)
      const suffix = text.substring(index + keyword.length, Math.min(text.length, index + keyword.length + 25)).trim();
      const suffixClauses = suffix.split(/[,.;]|\bbut\b|\band\b/i);
      const immediateSuffix = suffixClauses[0].trim();
      
      const isSuffixNegated = suffixNegationRegex.test(immediateSuffix);

      if (!isPrefixNegated && !isSuffixNegated) {
        return true; // Found an active, non-negated emergency keyword!
      }

      // Find next occurrence of the same keyword in the string
      index = text.indexOf(keyword, index + 1);
    }
  }

  return false;
};

module.exports = {
  checkEmergency,
  emergencyKeywords,
};
