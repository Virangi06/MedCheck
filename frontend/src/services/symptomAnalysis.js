const symptomKeywords = {
  cardiology: ['chest', 'heart', 'pressure', 'palpitation', 'shortness'],
  neurology: ['headache', 'migraine', 'dizziness', 'vertigo', 'tremor', 'seizure'],
  pulmonology: ['cough', 'shortness', 'breathing', 'asthma', 'wheeze'],
  gastroenterology: ['nausea', 'vomiting', 'abdominal', 'diarrhea', 'constipation', 'heartburn'],
  rheumatology: ['joint', 'arthritis', 'inflammation', 'swelling', 'pain'],
  otolaryngology: ['throat', 'sore', 'ear', 'nose', 'voice', 'hoarse'],
  dermatology: ['skin', 'rash', 'itch', 'allergy', 'eczema', 'psoriasis'],
  endocrinology: ['diabetes', 'thyroid', 'weight', 'fatigue', 'hormones'],
};

const conditionDatabase = {
  cardiology: [
    { name: 'Hypertension', probability: 35, severity: 'moderate', description: 'High blood pressure requiring lifestyle changes and medication.' },
    { name: 'Angina', probability: 45, severity: 'high', description: 'Chest pain due to reduced blood flow to the heart.' },
    { name: 'Palpitations', probability: 30, severity: 'low', description: 'Noticeable heartbeats that may be benign.' },
  ],
  neurology: [
    { name: 'Migraine', probability: 50, severity: 'moderate', description: 'Intense headache with possible sensitivity to light.' },
    { name: 'Tension Headache', probability: 35, severity: 'low', description: 'Common headache from muscle tension or stress.' },
    { name: 'Vertigo', probability: 25, severity: 'moderate', description: 'Dizziness and loss of balance sensation.' },
  ],
  pulmonology: [
    { name: 'Common Cold', probability: 60, severity: 'low', description: 'Viral infection causing cough and runny nose.' },
    { name: 'Bronchitis', probability: 40, severity: 'moderate', description: 'Inflammation of airways with persistent cough.' },
    { name: 'Asthma', probability: 30, severity: 'moderate', description: 'Chronic condition with breathing difficulties.' },
  ],
  gastroenterology: [
    { name: 'Food Poisoning', probability: 55, severity: 'moderate', description: 'Illness from contaminated food requiring hydration.' },
    { name: 'Gastritis', probability: 40, severity: 'moderate', description: 'Stomach lining inflammation causing discomfort.' },
    { name: 'GERD', probability: 35, severity: 'low', description: 'Acid reflux causing heartburn and discomfort.' },
  ],
  rheumatology: [
    { name: 'Osteoarthritis', probability: 45, severity: 'moderate', description: 'Wear and tear of joints causing pain.' },
    { name: 'Rheumatoid Arthritis', probability: 30, severity: 'moderate', description: 'Autoimmune condition affecting multiple joints.' },
    { name: 'Muscle Strain', probability: 50, severity: 'low', description: 'Temporary muscle injury from overuse or injury.' },
  ],
  otolaryngology: [
    { name: 'Pharyngitis', probability: 55, severity: 'low', description: 'Sore throat from viral or bacterial infection.' },
    { name: 'Sinusitis', probability: 40, severity: 'moderate', description: 'Sinus inflammation causing congestion.' },
    { name: 'Otitis Media', probability: 30, severity: 'moderate', description: 'Middle ear infection causing pain.' },
  ],
  dermatology: [
    { name: 'Urticaria', probability: 50, severity: 'low', description: 'Allergic reaction causing itchy welts on skin.' },
    { name: 'Dermatitis', probability: 45, severity: 'low', description: 'Inflammatory skin condition from irritants.' },
    { name: 'Fungal Infection', probability: 35, severity: 'low', description: 'Fungal condition requiring antifungal treatment.' },
  ],
  endocrinology: [
    { name: 'Type 2 Diabetes', probability: 40, severity: 'moderate', description: 'Metabolic disorder affecting blood sugar.' },
    { name: 'Hypothyroidism', probability: 35, severity: 'moderate', description: 'Low thyroid hormone causing fatigue.' },
    { name: 'Metabolic Syndrome', probability: 30, severity: 'moderate', description: 'Group of conditions increasing disease risk.' },
  ],
};

const specialtyMap = {
  cardiology: 'Cardiologist',
  neurology: 'Neurologist',
  pulmonology: 'Pulmonologist',
  gastroenterology: 'Gastroenterologist',
  rheumatology: 'Rheumatologist',
  otolaryngology: 'ENT Specialist',
  dermatology: 'Dermatologist',
  endocrinology: 'Endocrinologist',
};

const getMatchingSpecialty = (symptom) => {
  const lowerSymptom = symptom.toLowerCase();
  for (const [specialty, keywords] of Object.entries(symptomKeywords)) {
    if (keywords.some(kw => lowerSymptom.includes(kw))) {
      return specialty;
    }
  }
  return 'general';
};

const calculateUrgency = (severity) => {
  switch (severity) {
    case 'severe':
      return 'high';
    case 'moderate':
      return 'moderate';
    default:
      return 'low';
  }
};

const calculateSeverityScore = (severity, duration) => {
  let score = 0;
  switch (severity) {
    case 'severe':
      score += 7;
      break;
    case 'moderate':
      score += 5;
      break;
    case 'mild':
      score += 2;
      break;
    default:
      score += 1;
  }

  if (duration && duration.includes('week')) {
    score += 2;
  } else if (duration && duration.includes('day')) {
    score += 1;
  }

  return Math.min(10, Math.max(1, score));
};

export const analyzeSymptoms = (mainSymptom, otherSymptoms = [], duration = '', severity = '') => {
  const specialty = getMatchingSpecialty(mainSymptom);
  const conditions = specialty !== 'general' ? conditionDatabase[specialty] : conditionDatabase.cardiology;

  const adjustedConditions = conditions.map(cond => ({
    ...cond,
    probability: Math.max(20, cond.probability - (Math.random() * 15)),
  })).sort((a, b) => b.probability - a.probability).slice(0, 4);

  const urgency = calculateUrgency(severity);
  const severityScore = calculateSeverityScore(severity, duration);

  const nextSteps = [
    `Schedule an appointment with a ${specialtyMap[specialty] || 'healthcare professional'}`,
    'Keep a symptom diary to track patterns and triggers',
    severity === 'severe' ? 'Consider urgent care or emergency services if symptoms worsen' : 'Take over-the-counter medications as needed',
    'Stay hydrated and get adequate rest',
  ];

  return {
    conditions: adjustedConditions,
    urgency,
    recommendedSpecialty: specialtyMap[specialty] || 'General Practitioner',
    severityScore: Math.round(severityScore * 10) / 10,
    nextSteps: nextSteps.slice(0, 3),
    timestamp: new Date(),
  };
};
