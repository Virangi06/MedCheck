import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  Brain, User, Calendar, ShieldAlert, Pill, AlertTriangle,
  Activity, HeartPulse, VenusAndMars, ChevronRight, ChevronLeft,
  Thermometer, Loader2, Sparkles, Stethoscope, MapPin, Siren,
} from '../components/MedIcon';

import { profileAPI } from '../services/api';

const API = 'http://localhost:5000/api';

function SymptomChecker() {
  const navigate = useNavigate();
  const { profile, token } = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));

  // ── State ──────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  const [customDisease, setCustomDisease] = useState('');
  const [customMedication, setCustomMedication] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');

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

  // ── Load saved profile & GPS on mount ─────────────────────
  useEffect(() => {
    loadSavedProfile();
    requestLocation();
  }, [profile]);

  const loadSavedProfile = async () => {
    try {
      if (profile && profile.age) {
        prefillFromProfile(profile);
        setHasProfile(true);
        setStep(2);
      } else {
        setStep(1);
      }
    } catch (err) {
      console.warn('Could not load saved profile:', err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const prefillFromProfile = (p) => {
    setFormData(prev => ({
      ...prev,
      fullName: p.fullName || user?.name || '',
      age: p.age || '',
      gender: p.gender || '',
      height: p.height || '',
      weight: p.weight || '',
      diseases: p.diseases === 'None' ? '' : (p.diseases || ''),
      medications: p.medications === 'None' ? '' : (p.medications || ''),
      allergies: p.allergies === 'None' ? '' : (p.allergies || ''),
    }));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => { console.log(err); setLocationError('Location permission denied'); }
    );
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.age)         newErrors.age         = 'Age is required';
    if (!formData.gender)      newErrors.gender      = 'Gender is required';
    if (!formData.diseases)    newErrors.diseases    = 'Please select disease';
    if (!formData.medications) newErrors.medications = 'Please select medication';
    if (!formData.allergies)   newErrors.allergies   = 'Please select allergy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.symptoms) newErrors.symptoms = 'Symptoms are required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    if (!formData.bodyArea) newErrors.bodyArea = 'Affected body area required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Step 1 profile to DB (called once on first submit, or on manual edit)
  const saveProfile = async () => {
    try {
      const profilePayload = {
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        diseases: formData.diseases === 'Other' ? customDisease : formData.diseases,
        medications: formData.medications === 'Other' ? customMedication : formData.medications,
        allergies: formData.allergies === 'Other' ? customAllergy : formData.allergies,
      };
      const data = await profileAPI.update(profilePayload);
      setHasProfile(true);
    } catch (err) {
      console.warn('Profile save failed (non-critical):', err.message);
    }
  };

  const handleStep1Continue = async () => {
    if (!validateStep1()) return;
    // Save profile to DB on first time (or after editing)
    await saveProfile();
    setStep(2);
  };

  // ── AI Analysis ────────────────────────────────────────────
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        location,
        diseases:    formData.diseases    === 'Other' ? customDisease     : formData.diseases,
        medications: formData.medications === 'Other' ? customMedication  : formData.medications,
        allergies:   formData.allergies   === 'Other' ? customAllergy     : formData.allergies,
      };

      const response = await axios.post(`${API}/analysis/analyze`, finalData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = response.data.analysis;
      setAnalysis(result);

      // ✅ Cache to localStorage so dashboard reads it instantly without refetch
      const historyEntry = {
        _id:       response.data.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
        inputData: finalData,
        result,
      };
      const existing = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      const updated  = [historyEntry, ...existing].slice(0, 20);
      localStorage.setItem('analysisHistory', JSON.stringify(updated));

      setStep(3);
    } catch (error) {
      console.error('AI ANALYSIS ERROR:', error);
      alert(error?.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Loading screen while checking DB for saved profile ────
  if (profileLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <Brain size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ fontWeight: '600' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '50px 20px', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#e0f2fe', color: '#0284c7', padding: '10px 20px', borderRadius: '999px', fontWeight: '600', marginBottom: '20px' }}>
            <Brain size={20} /> AI Symptom Analysis
          </div>
          <h1 style={{ fontSize: '58px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
            Smart Symptom Checker
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>
            Get AI-powered health analysis and nearby medical suggestions.
          </p>

          {/* Location status */}
          <div style={{ marginTop: '20px' }}>
            {location ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#166534', padding: '10px 16px', borderRadius: '999px', fontWeight: '600' }}>
                <MapPin size={18} /> Live Location Connected
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#b91c1c', padding: '10px 16px', borderRadius: '999px', fontWeight: '600' }}>
                <AlertTriangle size={18} /> {locationError || 'Fetching location...'}
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS DOTS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ width: step >= s ? '40px' : '14px', height: '14px', borderRadius: '999px', background: step >= s ? '#0ea5e9' : '#cbd5e1', transition: '0.3s' }} />
          ))}
        </div>

        {/* ── STEP 1: Basic Info ─────────────────────────── */}
        {step === 1 && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ ...titleStyle, margin: 0 }}>Step 1: Basic Information</h2>
            </div>

            <div style={gridStyle}>
              <InputBox icon={<User size={18} />} label="Full Name" value={formData.fullName} disabled />

              <InputBox icon={<Calendar size={18} />} label="Age *" name="age" value={formData.age} onChange={handleChange} error={errors.age} type="number" placeholder="e.g. 28" />

              <SelectBox icon={<VenusAndMars size={18} />} label="Gender *" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender}
                options={['Male', 'Female', 'Other']} />

              <InputBox icon={<Activity size={18} />} label="Height (cm, optional)" name="height" value={formData.height} onChange={handleChange} type="number" placeholder="e.g. 170" />

              <InputBox icon={<HeartPulse size={18} />} label="Weight (kg, optional)" name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="e.g. 65" />

              {/* Diseases */}
              <div>
                <SelectBox icon={<ShieldAlert size={18} />} label="Existing Diseases *" name="diseases" value={formData.diseases} onChange={handleChange} error={errors.diseases}
                  options={['None', 'Diabetes', 'Asthma', 'Blood Pressure', 'Heart Disease', 'Other']} />
                {formData.diseases === 'Other' && (
                  <input type="text" placeholder="Enter disease" value={customDisease} onChange={(e) => setCustomDisease(e.target.value)} style={otherInputStyle} />
                )}
              </div>

              {/* Medications */}
              <div>
                <SelectBox icon={<Pill size={18} />} label="Current Medications *" name="medications" value={formData.medications} onChange={handleChange} error={errors.medications}
                  options={['None', 'Paracetamol', 'Insulin', 'BP Medication', 'Asthma Inhaler', 'Other']} />
                {formData.medications === 'Other' && (
                  <input type="text" placeholder="Enter medication" value={customMedication} onChange={(e) => setCustomMedication(e.target.value)} style={otherInputStyle} />
                )}
              </div>

              {/* Allergies */}
              <div>
                <SelectBox icon={<AlertTriangle size={18} />} label="Allergies *" name="allergies" value={formData.allergies} onChange={handleChange} error={errors.allergies}
                  options={['None', 'Dust', 'Pollen', 'Food Allergy', 'Medicine Allergy', 'Other']} />
                {formData.allergies === 'Other' && (
                  <input type="text" placeholder="Enter allergy" value={customAllergy} onChange={(e) => setCustomAllergy(e.target.value)} style={otherInputStyle} />
                )}
              </div>
            </div>

            <button onClick={handleStep1Continue} style={buttonStyle}>
              Save & Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Symptom Details ────────────────────── */}
        {step === 2 && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ ...titleStyle, margin: 0 }}>Step 2: Symptom Details</h2>
              {/* Allow editing profile even when it's pre-filled */}
              {hasProfile && (
                <button
                  onClick={() => setStep(1)}
                  style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* Profile summary strip */}
            {hasProfile && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#166534', fontWeight: '600' }}>
                ✅ Health profile loaded — {formData.fullName}, {formData.age} yrs, {formData.gender}
              </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
              <InputBox icon={<Thermometer size={18} />} label="Symptoms *" name="symptoms" value={formData.symptoms} onChange={handleChange} error={errors.symptoms} placeholder="e.g. headache, fever, fatigue" />

              <SelectBox icon={<Calendar size={18} />} label="Duration *" name="duration" value={formData.duration} onChange={handleChange} error={errors.duration}
                options={['1-2 Days', '3-7 Days', '1-2 Weeks', 'More than 2 Weeks']} />

              <SelectBox icon={<AlertTriangle size={18} />} label="Severity *" name="severity" value={formData.severity} onChange={handleChange} error={errors.severity}
                options={['Mild', 'Moderate', 'Severe']} />

              <InputBox icon={<Stethoscope size={18} />} label="Affected Body Area *" name="bodyArea" value={formData.bodyArea} onChange={handleChange} error={errors.bodyArea} placeholder="e.g. chest, head, abdomen" />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
              {!hasProfile && (
                <button onClick={() => setStep(1)} style={{ ...buttonStyle, background: '#e2e8f0', color: '#0f172a', marginTop: 0 }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button
                onClick={() => { if (validateStep2()) handleAnalyze(); }}
                style={{ ...buttonStyle, marginTop: 0, flex: 1 }}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                ) : (
                  <>Analyze Symptoms <Sparkles size={18} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Results ───────────────────────────── */}
        {step === 3 && analysis && (
          <div style={{ background: 'white', borderRadius: '28px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
              <Brain size={36} color="#0284c7" />
              <div>
                <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Health Analysis Results</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>AI-powered medical assessment based on your symptoms</p>
              </div>
            </div>

            {/* Explanation */}
            <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '16px', marginBottom: '18px', border: '1px solid #bfdbfe' }}>
              <p style={{ color: '#1e40af', lineHeight: '1.8', fontSize: '15px', margin: 0 }}>
                {analysis.conditionExplanation}
              </p>
              <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/patient/dashboard')}
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
                >
                  View on Dashboard →
                </button>
                <button
                  onClick={() => { setStep(2); setAnalysis(null); setFormData(f => ({ ...f, symptoms: '', duration: '', severity: '', bodyArea: '' })); }}
                  style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 18px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Key findings grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
              {[
                { label: 'Possible Condition', value: analysis.possibleCondition },
                { label: 'Urgency Level',      value: analysis.urgencyLevel },
                { label: 'Doctor Type',        value: analysis.recommendedDoctor },
                { label: 'Specialist',         value: analysis.recommendedSpecialist },
              ].map((f, i) => (
                <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{f.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {analysis.precautions?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} color="#0284c7" /> Precautions
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: '1.8' }}>
                    {analysis.precautions.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {analysis.recommendedMedicines?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={20} color="#0284c7" /> Medicines
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: '1.8' }}>
                    {analysis.recommendedMedicines.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {analysis.dietRecommendation && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#0284c7" /> Diet
                  </h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{analysis.dietRecommendation}</p>
                </div>
              )}
              {analysis.recoveryAdvice && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HeartPulse size={20} color="#dc2626" /> Recovery
                  </h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{analysis.recoveryAdvice}</p>
                </div>
              )}
              {analysis.whenToSeeDoctor && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={20} color="#7c3aed" /> When to See Doctor
                  </h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{analysis.whenToSeeDoctor}</p>
                </div>
              )}
            </div>

            {/* Emergency */}
            {analysis.emergencyWarning && analysis.urgencyLevel === 'High' && (
              <div style={{ background: '#fef2f2', border: '2px solid #fecaca', padding: '20px', borderRadius: '12px', marginBottom: '40px' }}>
                <p style={{ color: '#991b1b', fontSize: '15px', lineHeight: '1.6', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Siren size={20} /> {analysis.emergencyWarning}
                </p>
              </div>
            )}

            {/* Nearby Doctors */}
            {analysis.nearbyDoctors?.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
                  <MapPin size={28} color="#0284c7" />
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Nearby Medical Facilities</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Real-time locations based on your GPS coordinates</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {analysis.nearbyDoctors.map((doctor, index) => (
                    <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,132,199,0.1)'; e.currentTarget.style.borderColor = '#0284c7'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                          <MapPin size={20} color="#0284c7" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', lineHeight: '1.3' }}>{doctor.name}</h4>
                          <p style={{ fontSize: '13px', color: '#0284c7', margin: 0, fontWeight: '600' }}>{doctor.type}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <span style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }}>📍</span>
                          <span>{doctor.address}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f9ff', padding: '10px 12px', borderRadius: '8px', fontSize: '14px' }}>
                          <span style={{ color: '#0284c7', fontWeight: '700' }}>
                            {typeof doctor.distance === 'number' ? doctor.distance.toFixed(1) : doctor.distance || 'N/A'} km
                          </span>
                          <span style={{ color: '#64748b', fontSize: '12px' }}>from your location</span>
                        </div>
                        {doctor.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                            <span>📞</span><span>{doctor.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function InputBox({ icon, label, error, ...props }) {
  return (
    <div>
      <label style={{ fontWeight: '600', color: '#0f172a', marginBottom: '8px', display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: error ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px' }}>
        {icon}
        <input {...props} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }} />
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}

function SelectBox({ icon, label, options, error, ...props }) {
  return (
    <div>
      <label style={{ fontWeight: '600', color: '#0f172a', marginBottom: '8px', display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: error ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px' }}>
        {icon}
        <select {...props} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '15px' }}>
          <option value="">Select option</option>
          {options.map((item, index) => <option key={index} value={item}>{item}</option>)}
        </select>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}

/* ── Styles ───────────────────────────────────────────────── */

const cardStyle = {
  background: 'white', borderRadius: '28px', padding: '40px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
};

const titleStyle = {
  fontSize: '42px', fontWeight: '800', marginBottom: '30px', color: '#0f172a',
};

const gridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px',
};

const buttonStyle = {
  marginTop: '30px', width: '100%',
  background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
  color: 'white', border: 'none', borderRadius: '16px', padding: '18px',
  fontSize: '16px', fontWeight: '600',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  cursor: 'pointer',
};

const otherInputStyle = {
  width: '100%', marginTop: '10px', padding: '14px',
  borderRadius: '14px', border: '1.5px solid #cbd5e1',
  outline: 'none', fontSize: '14px', boxSizing: 'border-box',
};

export default SymptomChecker;