import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import {
  Brain,
  User,
  Calendar,
  ShieldAlert,
  Pill,
  AlertTriangle,
  Activity,
  HeartPulse,
  VenusAndMars,
  ChevronRight,
  ChevronLeft,
  Thermometer,
  Loader2,
  Sparkles,

  Stethoscope,
  MapPin,
  Siren,
} from '../components/MedIcon';

function SymptomChecker() {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem('user')
  );


  const [step, setStep] = useState(1);

  const [loading, setLoading] =
    useState(false);

  const [analysis, setAnalysis] =
    useState(null);

  const [errors, setErrors] = useState(
    {}
  );

  const [location, setLocation] =
    useState(null);

  const [locationError, setLocationError] =
    useState('');

  const [customDisease, setCustomDisease] =
    useState('');

  const [
    customMedication,
    setCustomMedication,
  ] = useState('');

  const [customAllergy, setCustomAllergy] =
    useState('');

  const [formData, setFormData] =
    useState({
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

  /* =====================================================
     GET USER LOCATION
  ===================================================== */

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation not supported'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);

        setLocationError(
          'Location permission denied'
        );
      }
    );
  }, []);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

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

  /* =====================================================
     STEP 1 VALIDATION
  ===================================================== */

  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.age)
      newErrors.age = 'Age is required';

    if (!formData.gender)
      newErrors.gender =
        'Gender is required';

    if (!formData.diseases)
      newErrors.diseases =
        'Please select disease';

    if (!formData.medications)
      newErrors.medications =
        'Please select medication';

    if (!formData.allergies)
      newErrors.allergies =
        'Please select allergy';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     STEP 2 VALIDATION
  ===================================================== */

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

  /* =====================================================
     ANALYZE SYMPTOMS
  ===================================================== */

  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const token =
        localStorage.getItem('token');

      const finalData = {
        ...formData,

        location,

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

      console.log(
        'AI ANALYSIS:',
        response.data
      );

      setAnalysis(response.data.analysis);

      setAnalysis(response.data.analysis);

// ✅ Save to localStorage as dashboard fallback
const historyEntry = {
  _id: response.data.id || Date.now().toString(),
  createdAt: new Date().toISOString(),
  inputData: finalData,
  result: response.data.analysis,
};
const existing = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
const updated = [historyEntry, ...existing].slice(0, 20);
localStorage.setItem('analysisHistory', JSON.stringify(updated));

      setStep(3);
    } catch (error) {
      console.log(
        'AI ANALYSIS ERROR:',
        error
      );

      alert(
        error?.response?.data?.message ||
          'Analysis failed'
      );
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
            Get AI-powered health analysis
            and nearby medical suggestions.
          </p>

          {/* LOCATION STATUS */}

          <div
            style={{
              marginTop: '20px',
            }}
          >
            {location ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                }}
              >
                <MapPin size={18} />
                Live Location Connected
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                }}
              >
                <AlertTriangle size={18} />
                {locationError ||
                  'Fetching location...'}
              </div>
            )}
          </div>
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
                icon={
                  <VenusAndMars size={18} />
                }
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
                  icon={
                    <ShieldAlert size={18} />
                  }
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

              {/* MEDICATIONS */}

              <div>
                <SelectBox
                  icon={<Pill size={18} />}
                  label="Current Medications *"
                  name="medications"
                  value={
                    formData.medications
                  }
                  onChange={handleChange}
                  error={
                    errors.medications
                  }
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
                icon={
                  <Thermometer size={18} />
                }
                label="Symptoms *"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                error={errors.symptoms}
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
                icon={
                  <Stethoscope size={18} />
                }
                label="Affected Body Area *"
                name="bodyArea"
                value={formData.bodyArea}
                onChange={handleChange}
                error={errors.bodyArea}
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

        {/* STEP 3 - RESULTS */}

        {step === 3 &&
          analysis && (
            <div style={{
              background: 'white',
              borderRadius: '28px',
              padding: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            }}>
              {/* HEADER */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
                paddingBottom: '24px',
                borderBottom: '2px solid #e2e8f0',
              }}>
                <Brain size={36} color="#0284c7" />
                <div>
                  <h2 style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                  }}>
                    Health Analysis Results
                  </h2>
                  <p style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px',
                  }}>
                    AI-powered medical assessment based on your symptoms
                  </p>
                </div>
              </div>

              {/* ANALYSIS SUMMARY */}
              <div
                style={{
                  background: '#f0f9ff',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '18px',
                  border: '1px solid #bfdbfe',
                }}
              >
                <p
                  style={{
                    color: '#1e40af',
                    lineHeight: '1.8',
                    fontSize: '15px',
                    margin: 0,
                  }}
                >
                  {analysis.conditionExplanation}
                </p>

                {/* STEP 3 NAV TO DASHBOARD */}
                <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/patient/dashboard')}
                    style={{
                      background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontWeight: '800',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    Go to Dashboard →
                  </button>
                </div>
              </div>


              {/* KEY FINDINGS - GRID */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px',
              }}>
                {/* Condition */}
                <div style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Condition
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: 0,
                  }}>
                    {analysis.possibleCondition || 'N/A'}
                  </p>
                </div>

                {/* Urgency */}
                <div style={{
                  padding: '20px',
                  background: analysis.urgencyLevel === 'High' ? '#fef2f2' : '#f8fafc',
                  borderRadius: '12px',
                  border: analysis.urgencyLevel === 'High' ? '1px solid #fecaca' : '1px solid #e2e8f0',
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Urgency Level
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: analysis.urgencyLevel === 'High' ? '#dc2626' : '#0f172a',
                    margin: 0,
                  }}>
                    {analysis.urgencyLevel || 'N/A'}
                  </p>
                </div>

                {/* Doctor Type */}
                <div style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Recommended Doctor
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: 0,
                  }}>
                    {analysis.recommendedDoctor || 'N/A'}
                  </p>
                </div>

                {/* Specialist */}
                <div style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Specialist
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: 0,
                  }}>
                    {analysis.recommendedSpecialist || 'N/A'}
                  </p>
                </div>
              </div>

              {/* RECOMMENDATIONS SECTION */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}>
                {/* Precautions */}
                {analysis.precautions && analysis.precautions.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <ShieldAlert size={20} color="#0284c7" />
                      Precautions
                    </h3>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: '#475569',
                      fontSize: '14px',
                      lineHeight: '1.8',
                    }}>
                      {analysis.precautions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medicines */}
                {analysis.recommendedMedicines && analysis.recommendedMedicines.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Pill size={20} color="#0284c7" />
                      Medicines
                    </h3>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: '#475569',
                      fontSize: '14px',
                      lineHeight: '1.8',
                    }}>
                      {analysis.recommendedMedicines.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Diet */}
                {analysis.dietRecommendation && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Activity size={20} color="#0284c7" />
                      Diet
                    </h3>
                    <p style={{
                      color: '#475569',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {analysis.dietRecommendation}
                    </p>
                  </div>
                )}

                {/* Recovery */}
                {analysis.recoveryAdvice && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Activity size={20} color="#0284c7" />
                      Recovery
                    </h3>
                    <p style={{
                      color: '#475569',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {analysis.recoveryAdvice}
                    </p>
                  </div>
                )}

                {/* When to See Doctor */}
                {analysis.whenToSeeDoctor && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Calendar size={20} color="#0284c7" />
                      When to See Doctor
                    </h3>
                    <p style={{
                      color: '#475569',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {analysis.whenToSeeDoctor}
                    </p>
                  </div>
                )}
              </div>

              {/* EMERGENCY WARNING */}
              {analysis.emergencyWarning && analysis.urgencyLevel === 'High' && (
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #fecaca',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '40px',
                }}>
                  <p style={{
                    color: '#991b1b',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    margin: 0,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <Siren size={20} />
                    {analysis.emergencyWarning}
                  </p>
                </div>
              )}

              {/* NEARBY DOCTORS - REAL TIME */}
              {analysis.nearbyDoctors && analysis.nearbyDoctors.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid #e2e8f0',
                  }}>
                    <MapPin size={28} color="#0284c7" />
                    <div>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: '#0f172a',
                        margin: '0 0 4px 0',
                      }}>
                        Nearby Medical Facilities
                      </h3>
                      <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '13px',
                      }}>
                        Real-time locations based on your GPS coordinates
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                  }}>
                    {analysis.nearbyDoctors.map((doctor, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '20px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.1)';
                          e.currentTarget.style.borderColor = '#0284c7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          marginBottom: '16px',
                        }}>
                          <div style={{
                            background: '#e0f2fe',
                            padding: '10px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <MapPin size={20} color="#0284c7" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#0f172a',
                              margin: '0 0 4px 0',
                              lineHeight: '1.3',
                            }}>
                              {doctor.name}
                            </h4>
                            <p style={{
                              fontSize: '13px',
                              color: '#0284c7',
                              margin: 0,
                              fontWeight: '600',
                            }}>
                              {doctor.type}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#475569',
                          }}>
                            <span style={{
                              color: '#64748b',
                              marginTop: '2px',
                              flexShrink: 0,
                            }}>📍</span>
                            <span>{doctor.address}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#f0f9ff',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                          }}>
                            <span style={{
                              color: '#0284c7',
                              fontWeight: '700',
                            }}>
                              {typeof doctor.distance === 'number'
                                ? doctor.distance.toFixed(1)
                                : doctor.distance || 'N/A'} km
                            </span>
                            <span style={{
                              color: '#64748b',
                              fontSize: '12px',
                            }}>
                              from your location
                            </span>
                          </div>

                          {doctor.phone && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              color: '#475569',
                            }}>
                              <span>📞</span>
                              <span>{doctor.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NO NEARBY DOCTORS FOUND */}
              {(!analysis.nearbyDoctors || analysis.nearbyDoctors.length === 0) && location && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '40px',
                  textAlign: 'center',
                }}>
                  <p style={{
                    color: '#991b1b',
                    fontSize: '15px',
                    margin: 0,
                    fontWeight: '600',
                  }}>
                    ⚠️ No nearby medical facilities found in your area.
                    Please check your location permission or try again later.
                  </p>
                  <p style={{
                    color: '#64748b',
                    fontSize: '13px',
                    margin: '8px 0 0 0',
                  }}>
                    Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

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

          {options.map(
            (item, index) => (
              <option
                key={index}
                value={item}
              >
                {item}
              </option>
            )
          )}
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
  return null;
}

/* =====================================================
   STYLES
===================================================== */

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

const otherInputStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '14px',
  borderRadius: '14px',
  border: '1.5px solid #cbd5e1',
  outline: 'none',
  fontSize: '14px',
};

export default SymptomChecker;