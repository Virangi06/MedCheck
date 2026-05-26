import { useState } from 'react';
import axios from 'axios';

import {
  Brain,
  User,
  Calendar,
  VenusAndMars,
  ShieldAlert,
  Pill,
  AlertTriangle,
  Activity,
  Thermometer,
  HeartPulse,
  Sparkles,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Loader2,
  MapPin,
  ShieldCheck,
  Siren,
} from 'lucide-react';

function SymptomChecker() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    diseases: '',
    medications: '',
    allergies: '',
    symptoms: '',
    duration: '',
    severity: '',
    bodyArea: '',
  });

  const [errors, setErrors] = useState({});

  const [analysis, setAnalysis] = useState(null);

  const [customDisease, setCustomDisease] =
    useState('');

  const [customMedication, setCustomMedication] =
    useState('');

  const [customAllergy, setCustomAllergy] =
    useState('');

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  // STEP 1 VALIDATION
  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.age)
      newErrors.age = 'Age is required';

    if (!formData.gender)
      newErrors.gender = 'Gender is required';

    if (!formData.diseases)
      newErrors.diseases =
        'Please select existing disease';

    if (!formData.medications)
      newErrors.medications =
        'Please select medication';

    if (!formData.allergies)
      newErrors.allergies =
        'Please select allergy';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // STEP 2 VALIDATION
  const validateStep2 = () => {
    let newErrors = {};

    if (!formData.symptoms)
      newErrors.symptoms =
        'Symptoms are required';

    if (!formData.duration)
      newErrors.duration =
        'Duration is required';

    if (!formData.severity)
      newErrors.severity =
        'Severity is required';

    if (!formData.bodyArea)
      newErrors.bodyArea =
        'Affected body area required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // REAL AI ANALYSIS
  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const finalData = {
        ...formData,

        diseases:
          formData.diseases === 'Other'
            ? customDisease
            : formData.diseases,

        medications:
          formData.medications === 'Other'
            ? customMedication
            : formData.medications,

        allergies:
          formData.allergies === 'Other'
            ? customAllergy
            : formData.allergies,
      };

      const response = await axios.post(
        'http://localhost:5000/api/analysis/analyze',
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);

      setStep(3);
    } catch (error) {
      console.log(error);

      alert('AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '50px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#e0f2fe',
              color: '#0284c7',
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            <Brain size={20} />
            AI Symptom Analysis
          </div>

          <h1
            style={{
              fontSize: '58px',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '10px',
            }}
          >
            Smart Symptom Checker
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '18px',
            }}
          >
            Get AI-powered health analysis and
            medical insights instantly.
          </p>
        </div>

        {/* PROGRESS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: step >= s ? '40px' : '14px',
                height: '14px',
                borderRadius: '999px',
                background:
                  step >= s
                    ? '#0ea5e9'
                    : '#cbd5e1',
                transition: '0.3s',
              }}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={cardStyle}>
            <h2 style={titleStyle}>
              Step 1: Basic Information
            </h2>

            <div style={gridStyle}>
              <InputBox
                icon={<User size={18} />}
                label="Full Name"
                value={formData.fullName}
                disabled
              />

              <InputBox
                icon={<Calendar size={18} />}
                label="Age *"
                name="age"
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
              />

              <SelectBox
                icon={<VenusAndMars size={18} />}
                label="Gender *"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                options={[
                  'Male',
                  'Female',
                  'Other',
                ]}
              />

              <InputBox
                icon={<Activity size={18} />}
                label="Height (Optional)"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />

              <InputBox
                icon={<HeartPulse size={18} />}
                label="Weight (Optional)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />

              {/* DISEASES */}
              <div>
                <SelectBox
                  icon={<ShieldAlert size={18} />}
                  label="Existing Diseases *"
                  name="diseases"
                  value={formData.diseases}
                  onChange={handleChange}
                  error={errors.diseases}
                  options={[
                    'None',
                    'Diabetes',
                    'Asthma',
                    'Blood Pressure',
                    'Heart Disease',
                    'Other',
                  ]}
                />

                {formData.diseases ===
                  'Other' && (
                  <input
                    type="text"
                    placeholder="Enter disease"
                    value={customDisease}
                    onChange={(e) =>
                      setCustomDisease(
                        e.target.value
                      )
                    }
                    style={otherInputStyle}
                  />
                )}
              </div>

              {/* MEDICATION */}
              <div>
                <SelectBox
                  icon={<Pill size={18} />}
                  label="Current Medications *"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  error={errors.medications}
                  options={[
                    'None',
                    'Paracetamol',
                    'Insulin',
                    'BP Medication',
                    'Asthma Inhaler',
                    'Other',
                  ]}
                />

                {formData.medications ===
                  'Other' && (
                  <input
                    type="text"
                    placeholder="Enter medication"
                    value={customMedication}
                    onChange={(e) =>
                      setCustomMedication(
                        e.target.value
                      )
                    }
                    style={otherInputStyle}
                  />
                )}
              </div>

              {/* ALLERGIES */}
              <div>
                <SelectBox
                  icon={
                    <AlertTriangle size={18} />
                  }
                  label="Allergies *"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  error={errors.allergies}
                  options={[
                    'None',
                    'Dust',
                    'Pollen',
                    'Food Allergy',
                    'Medicine Allergy',
                    'Other',
                  ]}
                />

                {formData.allergies ===
                  'Other' && (
                  <input
                    type="text"
                    placeholder="Enter allergy"
                    value={customAllergy}
                    onChange={(e) =>
                      setCustomAllergy(
                        e.target.value
                      )
                    }
                    style={otherInputStyle}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (validateStep1()) {
                  setStep(2);
                }
              }}
              style={buttonStyle}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={cardStyle}>
            <h2 style={titleStyle}>
              Step 2: Symptom Details
            </h2>

            <div
              style={{
                display: 'grid',
                gap: '20px',
              }}
            >
              <InputBox
                icon={<Thermometer size={18} />}
                label="Symptoms *"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                error={errors.symptoms}
                placeholder="e.g. fever, cough"
              />

              <SelectBox
                icon={<Calendar size={18} />}
                label="Duration *"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                error={errors.duration}
                options={[
                  '1-2 Days',
                  '3-7 Days',
                  '1-2 Weeks',
                  'More than 2 Weeks',
                ]}
              />

              <SelectBox
                icon={
                  <AlertTriangle size={18} />
                }
                label="Severity *"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                error={errors.severity}
                options={[
                  'Mild',
                  'Moderate',
                  'Severe',
                ]}
              />

              <InputBox
                icon={<Stethoscope size={18} />}
                label="Affected Body Area *"
                name="bodyArea"
                value={formData.bodyArea}
                onChange={handleChange}
                error={errors.bodyArea}
                placeholder="e.g. chest, head"
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '30px',
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  ...buttonStyle,
                  background: '#e2e8f0',
                  color: '#0f172a',
                }}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                onClick={() => {
                  if (validateStep2()) {
                    handleAnalyze();
                  }
                }}
                style={buttonStyle}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <Sparkles size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && analysis && (
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <Brain
                size={32}
                color="#0284c7"
              />

              <h2
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: '#0f172a',
                }}
              >
                AI Health Analysis
              </h2>
            </div>

            {/* SUMMARY */}
            <div
              style={{
                background: '#eff6ff',
                borderLeft:
                  '5px solid #0ea5e9',
                padding: '24px',
                borderRadius: '18px',
                marginBottom: '30px',
              }}
            >
              <p
                style={{
                  color: '#334155',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {analysis.conditionExplanation}
              </p>
            </div>

            {/* RESULT GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(250px,1fr))',
                gap: '20px',
              }}
            >
              <ResultCard
                icon={<ShieldCheck size={22} />}
                title="Possible Condition"
                value={analysis.possibleCondition}
              />

              <ResultCard
                icon={<Siren size={22} />}
                title="Urgency Level"
                value={analysis.urgencyLevel}
              />

              <ResultCard
                icon={<Stethoscope size={22} />}
                title="Recommended Doctor"
                value={analysis.recommendedDoctor}
              />
            </div>

            {/* PRECAUTIONS */}
            <div
              style={{
                marginTop: '35px',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  marginBottom: '16px',
                  color: '#0f172a',
                }}
              >
                Recommended Precautions
              </h3>

              <ul
                style={{
                  paddingLeft: '20px',
                  color: '#475569',
                  lineHeight: '2',
                }}
              >
                {analysis.precautions?.map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>

            {/* EMERGENCY WARNING */}
            <div
              style={{
                marginTop: '30px',
                background: '#fef2f2',
                borderLeft:
                  '5px solid #ef4444',
                padding: '24px',
                borderRadius: '18px',
              }}
            >
              <h3
                style={{
                  color: '#b91c1c',
                  marginBottom: '10px',
                }}
              >
                Emergency Warning
              </h3>

              <p
                style={{
                  color: '#7f1d1d',
                  lineHeight: '1.8',
                }}
              >
                {analysis.emergencyWarning}
              </p>
            </div>

            {/* RECOVERY */}
            <div
              style={{
                marginTop: '30px',
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(280px,1fr))',
                gap: '20px',
              }}
            >
              <ResultCard
                icon={<HeartPulse size={22} />}
                title="Diet Recommendation"
                value={analysis.dietRecommendation}
              />

              <ResultCard
                icon={<Activity size={22} />}
                title="Recovery Advice"
                value={analysis.recoveryAdvice}
              />
            </div>

            {/* NEARBY DOCTORS */}
            <div
              style={{
                marginTop: '40px',
              }}
            >
              <h3
                style={{
                  fontSize: '28px',
                  color: '#0f172a',
                  marginBottom: '20px',
                }}
              >
                Nearby Doctors
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit,minmax(250px,1fr))',
                  gap: '20px',
                }}
              >
                {[
                  {
                    name:
                      'Dr. Rajesh Sharma',
                    specialist:
                      analysis.recommendedDoctor,
                    distance: '1.2 km',
                  },
                  {
                    name:
                      'Dr. Priya Mehta',
                    specialist:
                      analysis.recommendedDoctor,
                    distance: '2.4 km',
                  },
                ].map((doctor, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '20px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                      }}
                    >
                      <MapPin
                        size={20}
                        color="#0284c7"
                      />

                      <h4
                        style={{
                          color: '#0f172a',
                          fontSize: '18px',
                        }}
                      >
                        {doctor.name}
                      </h4>
                    </div>

                    <p
                      style={{
                        color: '#475569',
                        marginBottom: '8px',
                      }}
                    >
                      {doctor.specialist}
                    </p>

                    <p
                      style={{
                        color: '#0284c7',
                        fontWeight: '600',
                      }}
                    >
                      {doctor.distance} away
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTS */

function InputBox({
  icon,
  label,
  error,
  ...props
}) {
  return (
    <div>
      <label
        style={{
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '8px',
          display: 'block',
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: error
            ? '1.5px solid #ef4444'
            : '1.5px solid #cbd5e1',
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        {icon}

        <input
          {...props}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '15px',
            background: 'transparent',
          }}
        />
      </div>

      {error && (
        <p
          style={{
            color: '#ef4444',
            fontSize: '13px',
            marginTop: '6px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SelectBox({
  icon,
  label,
  options,
  error,
  ...props
}) {
  return (
    <div>
      <label
        style={{
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '8px',
          display: 'block',
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: error
            ? '1.5px solid #ef4444'
            : '1.5px solid #cbd5e1',
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        {icon}

        <select
          {...props}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            background: 'transparent',
            fontSize: '15px',
          }}
        >
          <option value="">
            Select option
          </option>

          {options.map((item, index) => (
            <option
              key={index}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          style={{
            color: '#ef4444',
            fontSize: '13px',
            marginTop: '6px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function ResultCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: '20px',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        {icon}

        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          {title}
        </p>
      </div>

      <h3
        style={{
          color: '#0f172a',
          fontSize: '22px',
          fontWeight: '700',
        }}
      >
        {value}
      </h3>
    </div>
  );
}

/* STYLES */

const cardStyle = {
  background: 'white',
  borderRadius: '28px',
  padding: '40px',
  boxShadow:
    '0 10px 40px rgba(0,0,0,0.05)',
};

const titleStyle = {
  fontSize: '42px',
  fontWeight: '800',
  marginBottom: '30px',
  color: '#0f172a',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit,minmax(280px,1fr))',
  gap: '20px',
};

const otherInputStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '14px',
  borderRadius: '14px',
  border: '1.5px solid #cbd5e1',
  outline: 'none',
};

const buttonStyle = {
  marginTop: '30px',
  width: '100%',
  background:
    'linear-gradient(135deg,#0ea5e9,#0284c7)',
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  padding: '18px',
  fontSize: '16px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  cursor: 'pointer',
};

export default SymptomChecker;