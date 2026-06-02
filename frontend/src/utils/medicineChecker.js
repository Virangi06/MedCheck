// frontend/utils/medicineChecker.js

const interactionsDatabase = [
  {
    drugs: ['aspirin', 'ibuprofen'],
    severity: 'Warning',
    description: 'Both are nonsteroidal anti-inflammatory drugs (NSAIDs). Combining them increases the risk of stomach irritation, ulcers, and gastrointestinal bleeding.',
    alternatives: 'Acetaminophen (Paracetamol) can be used for pain relief instead of combining NSAIDs.'
  },
  {
    drugs: ['aspirin', 'warfarin'],
    severity: 'Dangerous',
    description: 'Warfarin is an anticoagulant (blood thinner) and aspirin also has blood-thinning properties. Combining them significantly increases the risk of serious bleeding.',
    alternatives: 'Consult a doctor. Paracetamol (Acetaminophen) is generally preferred for minor pain, but any combination must be medically supervised.'
  },
  {
    drugs: ['ibuprofen', 'lisinopril'],
    severity: 'Warning',
    description: 'NSAIDs like ibuprofen can decrease the blood pressure lowering effects of ACE inhibitors like lisinopril. It also increases the risk of kidney impairment.',
    alternatives: 'Acetaminophen (Paracetamol) is safer for short-term pain relief. Monitor blood pressure and kidney function.'
  },
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'Dangerous',
    description: 'Combining warfarin (blood thinner) and ibuprofen (NSAID) significantly increases the risk of gastrointestinal bleeding and reduces platelet aggregation.',
    alternatives: 'Acetaminophen (Paracetamol) is the preferred alternative for pain relief, but check with a healthcare provider.'
  },
  {
    drugs: ['sildenafil', 'nitroglycerin'],
    severity: 'Dangerous',
    description: 'Combining sildenafil (Viagra) and nitroglycerin (nitrates) can cause a sudden, severe, and potentially life-threatening drop in blood pressure.',
    alternatives: 'Avoid using nitrates within 24-48 hours of sildenafil. Consult a cardiologist for alternative angina treatments.'
  },
  {
    drugs: ['simvastatin', 'amlodipine'],
    severity: 'Warning',
    description: 'Amlodipine increases the concentration of simvastatin in the blood, which significantly increases the risk of muscle pain, weakness, and rhabdomyolysis (muscle breakdown).',
    alternatives: 'Do not exceed 20 mg of simvastatin daily when taking amlodipine, or switch simvastatin to atorvastatin or rosuvastatin.'
  },
  {
    drugs: ['simvastatin', 'grapefruit juice'],
    severity: 'Warning',
    description: 'Grapefruit juice inhibits CYP3A4 enzymes, raising blood levels of simvastatin and increasing the risk of muscle toxicity.',
    alternatives: 'Avoid grapefruit juice entirely while on simvastatin. Switch to other juices like orange juice.'
  },
  {
    drugs: ['metformin', 'contrast dye'],
    severity: 'Dangerous',
    description: 'Iodinated contrast dye used in imaging can cause kidney damage, which may lead to metformin accumulation and a life-threatening condition called lactic acidosis.',
    alternatives: 'Temporarily stop metformin at the time of or prior to the procedure and withhold it for 48 hours after.'
  },
  {
    drugs: ['amoxicillin', 'methotrexate'],
    severity: 'Warning',
    description: 'Penicillins like amoxicillin can reduce the kidney clearance of methotrexate, leading to increased levels of methotrexate and potential toxicity.',
    alternatives: 'Monitor methotrexate levels closely if combined, or use alternative antibiotics like macrolides.'
  },
  {
    drugs: ['spironolactone', 'lisinopril'],
    severity: 'Warning',
    description: 'Both medications can increase potassium levels in the blood. Combining them significantly increases the risk of hyperkalemia (high blood potassium).',
    alternatives: 'Regularly monitor serum potassium and kidney function. A doctor may reduce the dosage of one or both medications.'
  },
  {
    drugs: ['albuterol', 'propranolol'],
    severity: 'Dangerous',
    description: 'Propranolol is a non-selective beta-blocker that can block the bronchodilation effect of albuterol, rendering it ineffective and potentially causing severe bronchospasms.',
    alternatives: 'Use selective beta-blockers (e.g. metoprolol) with caution, or seek alternative blood pressure control medications.'
  },
  {
    drugs: ['clonidine', 'propranolol'],
    severity: 'Dangerous',
    description: 'If both clonidine and propranolol are taken and discontinued abruptly, or discontinued in the wrong order, it can lead to a rapid, life-threatening spike in blood pressure.',
    alternatives: 'Discontinue propranolol first, several days before slowly tapering off clonidine.'
  },
  {
    drugs: ['levothyroxine', 'calcium carbonate'],
    severity: 'Warning',
    description: 'Calcium carbonate reduces the absorption of levothyroxine, leading to reduced efficacy of thyroid treatment.',
    alternatives: 'Administer levothyroxine and calcium carbonate at least 4 hours apart.'
  },
  {
    drugs: ['digoxin', 'furosemide'],
    severity: 'Warning',
    description: 'Furosemide can lower potassium and magnesium levels, making the heart more sensitive to digoxin and increasing the risk of digoxin toxicity.',
    alternatives: 'Monitor electrolyte levels regularly. Potassium supplements may be prescribed.'
  },
  {
    drugs: ['ginkgo biloba', 'warfarin'],
    severity: 'Warning',
    description: 'Ginkgo biloba has antiplatelet properties and can increase the risk of bleeding when taken with anticoagulants like warfarin.',
    alternatives: 'Avoid ginkgo biloba while taking warfarin.'
  },
  {
    drugs: ['alcohol', 'acetaminophen'],
    severity: 'Warning',
    description: 'Chronic alcohol consumption combined with paracetamol (acetaminophen) increases the risk of severe liver damage (hepatotoxicity).',
    alternatives: 'Limit alcohol intake. Do not exceed 3,000 mg of acetaminophen per day.'
  },
  {
    drugs: ['alcohol', 'metformin'],
    severity: 'Dangerous',
    description: 'Alcohol increases the risk of metformin-induced lactic acidosis, a rare but life-threatening emergency.',
    alternatives: 'Avoid excessive alcohol consumption while taking metformin.'
  },
  {
    drugs: ['fluoxetine', 'tramadol'],
    severity: 'Dangerous',
    description: 'Combining fluoxetine (Prozac) and tramadol increases the risk of serotonin syndrome, a life-threatening condition.',
    alternatives: 'Use alternative pain relievers that do not affect serotonin.'
  }
];

/**
 * Check interactions locally in the frontend
 * @param {Array<string>} medicines - List of medicine names
 * @returns {Array<object>} - List of interactions found
 */
export const checkInteractionsLocally = (medicines) => {
  if (!Array.isArray(medicines) || medicines.length < 1) {
    return [];
  }

  const normalizedMeds = medicines
    .map(m => m.trim().toLowerCase())
    .filter(m => m.length > 0);

  const foundInteractions = [];

  for (let i = 0; i < normalizedMeds.length; i++) {
    for (let j = i + 1; j < normalizedMeds.length; j++) {
      const medA = normalizedMeds[i];
      const medB = normalizedMeds[j];

      const interaction = interactionsDatabase.find(item => {
        const drug1 = item.drugs[0];
        const drug2 = item.drugs[1];

        return (medA.includes(drug1) && medB.includes(drug2)) || 
               (medA.includes(drug2) && medB.includes(drug1));
      });

      if (interaction) {
        const originalA = medicines.find(m => m.toLowerCase().includes(interaction.drugs[0]) || m.toLowerCase().includes(interaction.drugs[1]));
        const originalB = medicines.find(m => m.toLowerCase().includes(interaction.drugs[0]) || m.toLowerCase().includes(interaction.drugs[1]) && m !== originalA);
        
        foundInteractions.push({
          medicationA: originalA || interaction.drugs[0],
          medicationB: originalB || interaction.drugs[1],
          severity: interaction.severity,
          description: interaction.description,
          alternatives: interaction.alternatives
        });
      }
    }
  }

  return foundInteractions;
};
