import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedCheckLogo from '../components/MedCheckLogo';

import {
  Brain, User, Calendar, ShieldAlert, Pill, AlertTriangle,
  Activity, HeartPulse, VenusAndMars, ChevronRight, ChevronLeft,
  Thermometer, Sparkles, Stethoscope, MapPin, Siren, Download,
} from '../components/MedIcon';

import { profileAPI } from '../services/api';
import generateAnalysisPDF from '../utils/generateAnalysisPDF';
import { checkInteractionsLocally } from '../utils/medicineChecker';

const envUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

// A robust helper to parse partial JSON string returned by LLM stream in real-time.
// It uses regex to match completed key-value pairs or streaming partial values.
const parsePartialJSON = (accumulatedText) => {
  const result = {};

  const keys = [
    "possibleCondition",
    "conditionExplanation",
    "urgencyLevel",
    "recommendedDoctor",
    "recommendedSpecialist",
    "dietRecommendation",
    "recoveryAdvice",
    "emergencyWarning",
    "whenToSeeDoctor"
  ];

  // Clean raw markdown wrappers if model starts outputting them (e.g. ```json or ```)
  let text = accumulatedText.trim();
  if (text.startsWith('```json')) {
    text = text.substring(7);
  } else if (text.startsWith('```')) {
    text = text.substring(3);
  }
  text = text.trim();

  keys.forEach(key => {
    // 1. Look for closed quotes first: "key": "value"
    const closedRegex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`);
    const closedMatch = text.match(closedRegex);
    if (closedMatch) {
      result[key] = closedMatch[1];
    } else {
      // 2. Look for open quotes (still streaming): "key": "value...
      const openRegex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)$`);
      const openMatch = text.match(openRegex);
      if (openMatch) {
        result[key] = openMatch[1];
      }
    }
  });

  // Extract arrays (precautions, recommendedMedicines)
  const arrayKeys = ["precautions", "recommendedMedicines"];
  arrayKeys.forEach(key => {
    const arrayRegex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)\\]`);
    const arrayMatch = text.match(arrayRegex);
    if (arrayMatch) {
      try {
        const elementsStr = arrayMatch[1];
        result[key] = elementsStr
          .split(',')
          .map(item => {
            const m = item.match(/"([^"]*)"/);
            return m ? m[1] : null;
          })
          .filter(Boolean);
      } catch (e) {
        result[key] = [];
      }
    } else {
      // If array is still streaming: "key": [ "elem1", "elem2
      const openArrayRegex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]*)$`);
      const openArrayMatch = text.match(openArrayRegex);
      if (openArrayMatch) {
        const elementsStr = openArrayMatch[1];
        result[key] = elementsStr
          .split(',')
          .map(item => {
            const m = item.match(/"([^"]*)"/);
            return m ? m[1] : null;
          })
          .filter(Boolean);
      } else {
        result[key] = [];
      }
    }
  });

  return result;
};

function SymptomChecker() {
  const navigate = useNavigate();
  const { profile, token } = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));

  // ── State ──────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
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

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const selectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validateStep1 = () => {
    let newErrors = {};
    if (!formData.age)         newErrors.age         = 'Age is required';
    if (!formData.gender)      newErrors.gender      = 'Gender is required';
    if (!formData.diseases)    newErrors.diseases    = 'Please select disease status';
    if (!formData.medications) newErrors.medications = 'Please select medication status';
    if (!formData.allergies)   newErrors.allergies   = 'Please select allergy status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.symptoms) newErrors.symptoms = 'Symptoms description is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.severity) newErrors.severity = 'Severity level is required';
    if (!formData.bodyArea) newErrors.bodyArea = 'Affected body area is required';
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
      await profileAPI.update(profilePayload);
      setHasProfile(true);
    } catch (err) {
      console.warn('Profile save failed (non-critical):', err.message);
    }
  };

  const handleStep1Continue = async () => {
    if (!validateStep1()) return;
    await saveProfile();
    setStep(2);
  };

  // ── AI Analysis (SSE Streaming) ────────────────────────────
  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    setIsStreaming(true);
    try {
      const finalData = {
        ...formData,
        location,
        diseases:    formData.diseases    === 'Other' ? customDisease     : formData.diseases,
        medications: formData.medications === 'Other' ? customMedication  : formData.medications,
        allergies:   formData.allergies   === 'Other' ? customAllergy     : formData.allergies,
      };

      // Call raw fetch for streaming support
      const response = await fetch(`${API}/analysis/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Analysis failed');
      }

      setStep(3);
      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine) continue;
          if (cleanedLine.startsWith('data: ')) {
            try {
              const dataPacket = JSON.parse(cleanedLine.substring(6));
              
              if (dataPacket.event === 'chunk') {
                accumulatedText += dataPacket.text;
                // Parse accumulated text stream and set state live
                const parsed = parsePartialJSON(accumulatedText);
                setAnalysis(prev => ({
                  ...prev,
                  ...parsed
                }));
              } else if (dataPacket.event === 'done') {
                setIsStreaming(false);
                // Done event: contains the saved DB id and the list of nearby doctors
                setAnalysis(prev => ({
                  ...prev,
                  id: dataPacket.id,
                  nearbyDoctors: dataPacket.nearbyDoctors
                }));

                // ✅ Cache to localStorage so dashboard reads it instantly without refetch
                const historyEntry = {
                  _id:       dataPacket.id || Date.now().toString(),
                  createdAt: new Date().toISOString(),
                  inputData: finalData,
                  result: {
                    ...parsePartialJSON(accumulatedText),
                    nearbyDoctors: dataPacket.nearbyDoctors
                  },
                };
                const existing = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
                const updated  = [historyEntry, ...existing].slice(0, 20);
                localStorage.setItem('analysisHistory', JSON.stringify(updated));
              } else if (dataPacket.event === 'error') {
                setIsStreaming(false);
                alert(`Error during analysis stream: ${dataPacket.message}`);
              }
            } catch (err) {
              console.warn('Could not parse SSE packet line:', err.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI ANALYSIS ERROR:', error);
      alert(error.message || 'Analysis failed. Please try again.');
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleDownloadReport = () => {
    generateAnalysisPDF(analysis, formData, profile, user?.name || 'Patient', new Date());
  };

  // ── Loading screen while checking DB for saved profile ────
  if (profileLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <Brain size={44} style={{ opacity: 0.3, marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
          <p style={{ fontWeight: '600' }}>Syncing your profile...</p>
        </div>
      </div>
    );
  }

  // ── Loading screen during AI processing ────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a192f', fontFamily: "'DM Sans', sans-serif", color: '#e2e8f0', padding: '24px' }}>
        <style>{`
          .spinner-dna {
            position: relative;
            width: 80px; height: 80px;
            margin: 0 auto 32px;
          }
          .spinner-dot {
            position: absolute;
            width: 14px; height: 14px;
            border-radius: 50%;
            background: #38bdf8;
            animation: orbit 1.6s ease-in-out infinite;
          }
          .dot-1 { top: 0; left: 33px; animation-delay: 0s; background: #0ea5e9; }
          .dot-2 { top: 10px; right: 10px; animation-delay: -0.2s; background: #38bdf8; }
          .dot-3 { right: 0; top: 33px; animation-delay: -0.4s; background: #0ea5e9; }
          .dot-4 { bottom: 10px; right: 10px; animation-delay: -0.6s; background: #38bdf8; }
          .dot-5 { bottom: 0; left: 33px; animation-delay: -0.8s; background: #0ea5e9; }
          .dot-6 { bottom: 10px; left: 10px; animation-delay: -1s; background: #38bdf8; }
          .dot-7 { left: 0; top: 33px; animation-delay: -1.2s; background: #0ea5e9; }
          .dot-8 { top: 10px; left: 10px; animation-delay: -1.4s; background: #38bdf8; }
          
          @keyframes orbit {
            0%, 100% { transform: scale(0.6); opacity: 0.4; }
            50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 10px #0ea5e9); }
          }
          .pulse-status {
            animation: pulseFade 2.5s infinite;
          }
          @keyframes pulseFade {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
        <div style={{ textAlign: 'center', maxWidth: '420px', zIndex: 2 }}>
          <div className="spinner-dna">
            <div className="spinner-dot dot-1" />
            <div className="spinner-dot dot-2" />
            <div className="spinner-dot dot-3" />
            <div className="spinner-dot dot-4" />
            <div className="spinner-dot dot-5" />
            <div className="spinner-dot dot-6" />
            <div className="spinner-dot dot-7" />
            <div className="spinner-dot dot-8" />
          </div>
          <h2 style={{ fontSize: '26px', marginBottom: '12px', letterSpacing: '-0.5px', color: 'white' }}>Analyzing Health Profile</h2>
          <p className="pulse-status" style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
            Matching symptoms with clinical models, calculating diagnostics, and searching local facilities...
          </p>
          <div style={{ width: '180px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', margin: '0 auto', overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: '#0ea5e9', borderRadius: '999px', animation: 'slide-progress 1.5s infinite ease-in-out' }} />
            <style>{`
              @keyframes slide-progress {
                0% { margin-left: -40%; }
                100% { margin-left: 100%; }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f4f9ff', minHeight: '100vh', padding: '60px 0 0', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 24px 80px', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        .glass-container {
          background: white;
          border-radius: 32px;
          border: 1px solid #e0f0ff;
          box-shadow: 0 20px 50px rgba(14,165,233,0.06);
          padding: 48px;
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        
        .interactive-card {
          background: white;
          border: 1.5px solid #cbd5e1;
          border-radius: 18px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .interactive-card:hover {
          border-color: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14,165,233,0.06);
        }
        .interactive-card.selected {
          border-color: #0ea5e9;
          background: #f0f9ff;
          box-shadow: 0 8px 24px rgba(14,165,233,0.1);
        }
        
        .input-container {
          transition: all 0.2s ease;
        }
        .input-container:focus-within {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.12);
        }
        
        .action-btn {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          border: none;
          border-radius: 18px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 10px 25px rgba(14,165,233,0.3);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(14,165,233,0.4);
        }
        .action-btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
        }
        
        .pulse-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
          animation: pulseAnim 1.8s infinite;
        }
        @keyframes pulseAnim {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @media (max-width: 768px) {
          .glass-container {
            padding: 24px 16px !important;
            border-radius: 20px !important;
          }
          .responsive-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .responsive-grid-280, .responsive-grid-220 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .responsive-grid-130, .responsive-grid-160 {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 480px) {
          .responsive-grid-130, .responsive-grid-160 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* HEADER BAR */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e0f2fe', color: '#0284c7', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
            <Brain size={16} /> MedCheck Diagnostics
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px, 5vw, 54px)', color: '#0f172a', letterSpacing: '-1.5px', margin: '0 0 12px' }}>
            Symptom Assessment
          </h1>
          <p style={{ color: '#64748b', fontSize: '17px', margin: '0 0 24px' }}>
            Complete the steps below to trigger AI analysis and local specialist suggestions.
          </p>

          {/* Location status badge */}
          <div style={{ display: 'inline-block' }}>
            {location ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', fontSize: '14px', border: '1px solid #bbf7d0' }}>
                <span className="pulse-dot" style={{ background: '#22c55e' }} />
                <MapPin size={16} /> GPS Connected (Suggestions Live)
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#b91c1c', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', fontSize: '14px', border: '1px solid #fecaca' }}>
                <span className="pulse-dot" style={{ background: '#ef4444' }} />
                <AlertTriangle size={16} /> {locationError || 'Fetching Location...'}
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE PROGRESS ROW */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          {[
            { stepNum: 1, label: 'Profile' },
            { stepNum: 2, label: 'Symptoms' },
            { stepNum: 3, label: 'Analysis' }
          ].map((item, idx) => (
            <div key={item.stepNum} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? '1' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: step >= item.stepNum ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#cbd5e1',
                  color: 'white', fontWeight: '700', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: step >= item.stepNum ? '0 4px 10px rgba(14,165,233,0.2)' : 'none'
                }}>
                  {item.stepNum}
                </div>
                <span style={{ fontSize: '14px', fontWeight: step >= item.stepNum ? '700' : '500', color: step >= item.stepNum ? '#0f172a' : '#64748b' }}>
                  {item.label}
                </span>
              </div>
              {idx < 2 && (
                <div style={{ flex: 1, height: '3px', background: step > item.stepNum ? '#0ea5e9' : '#cbd5e1', margin: '0 16px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Basic Info ─────────────────────────── */}
        {step === 1 && (
          <div className="glass-container">
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', color: '#0f172a', fontWeight: '700', marginBottom: '10px' }}>
              Step 1: Patient Profile
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
              We customize analysis parameters based on your age, biological gender, and general health metrics.
            </p>

            <div className="responsive-grid-280" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <InputBox icon={<User size={18} color="#64748b" />} label="Full Name" value={formData.fullName} disabled />

              <InputBox icon={<Calendar size={18} color="#64748b" />} label="Age *" name="age" value={formData.age} onChange={handleChange} error={errors.age} type="number" placeholder="e.g. 28" />

              <InputBox icon={<Activity size={18} color="#64748b" />} label="Height (cm, optional)" name="height" value={formData.height} onChange={handleChange} type="number" placeholder="e.g. 170" />

              <InputBox icon={<HeartPulse size={18} color="#64748b" />} label="Weight (kg, optional)" name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="e.g. 65" />
            </div>

            {/* Premium Selector: Gender */}
            <div style={{ marginBottom: '36px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                Gender Selection *
              </label>
              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {['Male', 'Female', 'Other'].map(g => (
                  <div
                    key={g}
                    className={`interactive-card ${formData.gender === g ? 'selected' : ''}`}
                    onClick={() => selectOption('gender', g)}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: formData.gender === g ? '#0ea5e9' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: formData.gender === g ? 'white' : '#64748b', transition: '0.2s' }}>
                      <VenusAndMars size={20} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '15px' }}>{g}</span>
                  </div>
                ))}
              </div>
              {errors.gender && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.gender}</p>}
            </div>

            {/* Premium Selector: Diseases */}
            <div style={{ marginBottom: '36px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                Do you have any existing chronic conditions? *
              </label>
              <div className="responsive-grid-130" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {['None', 'Diabetes', 'Asthma', 'Blood Pressure', 'Heart Disease', 'Other'].map(item => (
                  <div
                    key={item}
                    className={`interactive-card ${formData.diseases === item ? 'selected' : ''}`}
                    style={{ padding: '16px 12px' }}
                    onClick={() => selectOption('diseases', item)}
                  >
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              {formData.diseases === 'Other' && (
                <div style={{ marginTop: '16px' }} className="input-container border-2 rounded-xl p-3 border-slate-300">
                  <input type="text" placeholder="Specify condition details..." value={customDisease} onChange={(e) => setCustomDisease(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
                </div>
              )}
              {errors.diseases && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.diseases}</p>}
            </div>

            {/* Premium Selector: Medications */}
            <div style={{ marginBottom: '36px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                Are you taking any routine medications? *
              </label>
              <div className="responsive-grid-130" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {['None', 'Paracetamol', 'Insulin', 'BP Medication', 'Asthma Inhaler', 'Other'].map(item => (
                  <div
                    key={item}
                    className={`interactive-card ${formData.medications === item ? 'selected' : ''}`}
                    style={{ padding: '16px 12px' }}
                    onClick={() => selectOption('medications', item)}
                  >
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              {formData.medications === 'Other' && (
                <div style={{ marginTop: '16px' }} className="input-container border-2 rounded-xl p-3 border-slate-300">
                  <input type="text" placeholder="Specify medication name..." value={customMedication} onChange={(e) => setCustomMedication(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
                </div>
              )}
              {errors.medications && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.medications}</p>}
            </div>

            {/* Premium Selector: Allergies */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                Do you have any known medical or environmental allergies? *
              </label>
              <div className="responsive-grid-130" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {['None', 'Dust', 'Pollen', 'Food Allergy', 'Medicine Allergy', 'Other'].map(item => (
                  <div
                    key={item}
                    className={`interactive-card ${formData.allergies === item ? 'selected' : ''}`}
                    style={{ padding: '16px 12px' }}
                    onClick={() => selectOption('allergies', item)}
                  >
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{item}</span>
                  </div>
                ))}
              </div>
              {formData.allergies === 'Other' && (
                <div style={{ marginTop: '16px' }} className="input-container border-2 rounded-xl p-3 border-slate-300">
                  <input type="text" placeholder="Specify allergy details..." value={customAllergy} onChange={(e) => setCustomAllergy(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
                </div>
              )}
              {errors.allergies && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.allergies}</p>}
            </div>

            <button onClick={handleStep1Continue} className="action-btn" style={{ width: '100%', padding: '18px' }}>
              Continue to Symptoms <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Symptom Details ────────────────────── */}
        {step === 2 && (
          <div className="glass-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', color: '#0f172a', margin: 0 }}>
                Step 2: Describe Symptoms
              </h2>
              {hasProfile && (
                <button
                  onClick={() => setStep(1)}
                  style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ✏️ Modify Profile
                </button>
              )}
            </div>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
              Explain what you are feeling as clearly as possible. We use this text data to build diagnostic risk profiles.
            </p>

            {hasProfile && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#166534', fontWeight: '600' }}>
                <span>✨</span> Health profile loaded successfully for {formData.fullName} ({formData.age} years old).
              </div>
            )}

            <div className="responsive-grid-280" style={{ display: 'grid', gap: '28px', marginBottom: '36px' }}>
              {/* Symptom Input */}
              <InputBox icon={<Thermometer size={18} color="#64748b" />} label="What symptoms are you experiencing? *" name="symptoms" value={formData.symptoms} onChange={handleChange} error={errors.symptoms} placeholder="e.g. throbbing headache, mild fever, nausea" />

              {/* Body Area */}
              <InputBox icon={<Stethoscope size={18} color="#64748b" />} label="Which body area is primary affected? *" name="bodyArea" value={formData.bodyArea} onChange={handleChange} error={errors.bodyArea} placeholder="e.g. head, upper chest, stomach" />
            </div>

            {/* Premium Selector: Duration */}
            <div style={{ marginBottom: '36px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                How long have these symptoms persisted? *
              </label>
              <div className="responsive-grid-160" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {['1-2 Days', '3-7 Days', '1-2 Weeks', 'More than 2 Weeks'].map(d => (
                  <div
                    key={d}
                    className={`interactive-card ${formData.duration === d ? 'selected' : ''}`}
                    style={{ padding: '18px 14px' }}
                    onClick={() => selectOption('duration', d)}
                  >
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>{d}</span>
                  </div>
                ))}
              </div>
              {errors.duration && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.duration}</p>}
            </div>

            {/* Premium Selector: Severity */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{ fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                How severe is the discomfort? *
              </label>
              <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { name: 'Mild', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Easily tolerated symptoms' },
                  { name: 'Moderate', color: '#eab308', bg: '#fefce8', border: '#fef08a', desc: 'Interferes with activities' },
                  { name: 'Severe', color: '#ef4444', bg: '#fef2f2', border: '#fecaca', desc: 'Requires immediate rest' }
                ].map(s => (
                  <div
                    key={s.name}
                    className={`interactive-card ${formData.severity === s.name ? 'selected' : ''}`}
                    style={{
                      border: formData.severity === s.name ? `2.5px solid ${s.color}` : '1.5px solid #cbd5e1',
                      background: formData.severity === s.name ? s.bg : 'white',
                      padding: '20px 14px'
                    }}
                    onClick={() => selectOption('severity', s.name)}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                    <span style={{ fontWeight: '500', fontSize: '16px', color: formData.severity === s.name ? '#0f172a' : '#475569' }}>{s.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{s.desc}</span>
                  </div>
                ))}
              </div>
              {errors.severity && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>{errors.severity}</p>}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {!hasProfile && (
                <button onClick={() => setStep(1)} className="action-btn" style={{ background: '#e2e8f0', color: '#0f172a', boxShadow: 'none' }}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              <button
                onClick={() => { if (validateStep2()) handleAnalyze(); }}
                className="action-btn"
                style={{ flex: 1 }}
              >
                Analyze Symptoms <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Results ───────────────────────────── */}
        {step === 3 && analysis && (
          <div style={{ background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(15,23,42,0.06)', border: '1px solid #e2e8f0' }}>

            {/* Diagnostics Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '36px', paddingBottom: '24px', borderBottom: '2px solid #f1f5f9' }}>
              <div style={{ background: '#e0f2fe', padding: '14px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={32} color="#0284c7" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px',  color: '#0f172a', margin: '0 0 4px 0' }}>Diagnostic Summary</h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>AI recommendation profile matched with real-time clinics</p>
                </div>
                {isStreaming && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff9ff', border: '1px solid #e0f2fe', borderRadius: '8px', padding: '6px 12px', color: '#0ea5e9', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span className="pulse-dot" style={{ background: '#0ea5e9' }} />
                    Streaming...
                  </div>
                )}
              </div>
            </div>

            {/* Primary Condition Block */}
            <div style={{ background: '#f0f9ff', padding: '28px', borderRadius: '24px', marginBottom: '32px', border: '1.5px solid #bee3f8', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', textTransform: 'uppercase' }}>
                Primary Match
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', color: '#0c2340', fontWeight: '500', marginBottom: '12px' }}>
                {analysis.possibleCondition || (isStreaming ? 'Analyzing symptoms...' : 'No major condition detected')}
              </h3>
              {analysis.conditionExplanation ? (
                <p style={{ color: '#2d3748', lineHeight: '1.8', fontSize: '15px', margin: 0 }}>
                  {analysis.conditionExplanation}
                </p>
              ) : isStreaming ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <div style={{ height: '14px', background: '#bee3f8', borderRadius: '4px', width: '95%', opacity: 0.7, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '14px', background: '#bee3f8', borderRadius: '4px', width: '85%', opacity: 0.7, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '14px', background: '#bee3f8', borderRadius: '4px', width: '60%', opacity: 0.7, animation: 'pulse 1.5s infinite' }} />
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>No explanation available</p>
              )}

            </div>

            {/* Metrics cards grid */}
            <div className="responsive-grid-280" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Recommended Doctor', value: analysis.recommendedDoctor, icon: '🩺' },
                { label: 'Target Specialist',  value: analysis.recommendedSpecialist, icon: '👨‍⚕️' },
                { label: 'Urgency Rating',     value: analysis.urgencyLevel, icon: '🚨', isUrgency: true },
              ].map((item, i) => {
                const isHigh = (item.value || '').toLowerCase() === 'high';
                const hasValue = !!item.value;
                return (
                  <div key={i} style={{ padding: '24px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '24px' }}>{item.icon}</div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                    {hasValue ? (
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: item.isUrgency && isHigh ? '#ef4444' : '#0f172a',
                        margin: 0
                      }}>
                        {item.value}
                      </p>
                    ) : (
                      <div style={{ height: '24px', background: '#e2e8f0', borderRadius: '6px', width: '70%', animation: 'pulse 1.5s infinite', marginTop: '4px' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detailed clinical breakdown tabs */}
            <div className="responsive-grid-280" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', marginBottom: '48px' }}>
              {analysis.precautions?.length > 0 ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <ShieldAlert size={18} color="#0ea5e9" /> Home Care Precautions
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '14px', lineHeight: '1.9' }}>
                    {analysis.precautions.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
                  </ul>
                </div>
              ) : isStreaming ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <ShieldAlert size={18} color="#cbd5e1" /> Precautions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ) : null}

              {(() => {
                const recommendedMeds = analysis.recommendedMedicines || [];
                const currentMeds = formData.medications === 'Other' ? customMedication : formData.medications;
                const profileMeds = currentMeds
                  ? currentMeds.split(',').map(m => m.trim()).filter(m => m && m.toLowerCase() !== 'none')
                  : [];
                const combined = [...new Set([...recommendedMeds, ...profileMeds])];
                const interactions = checkInteractionsLocally(combined);
                
                return recommendedMeds.length > 0 ? (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <Pill size={18} color="#0ea5e9" /> Suggested Relief
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '14px', lineHeight: '1.9' }}>
                      {recommendedMeds.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
                    </ul>
                    {interactions.length > 0 && (
                      <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Interaction Warning!
                        </p>
                        {interactions.map((inter, i) => (
                          <p key={i} style={{ margin: 0, fontSize: '12px', color: '#991b1b', lineHeight: 1.4 }}>
                            <strong>{inter.medicationA}</strong> interacts with <strong>{inter.medicationB}</strong>: {inter.description}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : isStreaming ? (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <Pill size={18} color="#cbd5e1" /> Relief Options
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '85%', animation: 'pulse 1.5s infinite' }} />
                      <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '65%', animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ) : null;
              })()}

              {analysis.dietRecommendation ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <Activity size={18} color="#0ea5e9" /> Nutritional Guidance
                  </h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{analysis.dietRecommendation}</p>
                </div>
              ) : isStreaming ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <Activity size={18} color="#cbd5e1" /> Nutrition Guidance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '75%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ) : null}

              {analysis.recoveryAdvice ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <HeartPulse size={18} color="#dc2626" /> Recovery Support
                  </h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>{analysis.recoveryAdvice}</p>
                </div>
              ) : isStreaming ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <HeartPulse size={18} color="#cbd5e1" /> Recovery Support
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '95%', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '65%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Severity Warning Alert Box */}
            {analysis.emergencyWarning && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', padding: '20px', borderRadius: '16px', marginBottom: '48px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Siren size={24} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>Medical Warning Notice</h4>
                  <p style={{ color: '#991b1b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{analysis.emergencyWarning}</p>
                </div>
              </div>
            )}

            {/* Nearby facilities grid */}
            {analysis.nearbyDoctors?.length > 0 ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
                  <div style={{ background: '#f0f9ff', padding: '8px', borderRadius: '10px' }}>
                    <MapPin size={22} color="#0284c7" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '500', color: '#0f172a', margin: 0 }}>Nearby Medical Facilities</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Matching specialists closest to your coordinates</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {analysis.nearbyDoctors.map((doctor, index) => (
                    <div
                      key={index}
                      style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '24px', transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(14,165,233,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '50px', fontWeight: '700' }}>
                            {doctor.type || 'Facility'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                            📍 {typeof doctor.distance === 'number' ? `${doctor.distance.toFixed(1)} km` : doctor.distance}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                          {doctor.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                          {doctor.address}
                        </p>
                      </div>
                      
                      {doctor.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '13px' }}>
                          <span style={{ color: '#0284c7', fontWeight: '700' }}>{doctor.phone}</span>
                          <a
                            href={`tel:${doctor.phone}`}
                            style={{ textDecoration: 'none', background: '#0284c7', color: 'white', padding: '6px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '12px' }}
                          >
                            Call
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : isStreaming ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: '3px solid #f1f5f9', borderTop: '3px solid #0ea5e9',
                  animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Waiting for stream to complete to fetch local clinics...</p>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #f1f5f9', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/patient/dashboard')}
                disabled={isStreaming}
                className="action-btn"
                style={{ padding: '14px 28px', fontSize: '15px', opacity: isStreaming ? 0.6 : 1, cursor: isStreaming ? 'not-allowed' : 'pointer' }}
              >
                Go to Dashboard →
              </button>
              <button
                onClick={handleDownloadReport}
                disabled={isStreaming}
                className="action-btn"
                style={{ padding: '14px 28px', fontSize: '15px', background: 'linear-gradient(135deg, #10b981, #059669)', opacity: isStreaming ? 0.6 : 1, cursor: isStreaming ? 'not-allowed' : 'pointer' }}
              >
                <Download size={18} /> Download Report
              </button>
              <button
                onClick={() => { setStep(2); setAnalysis(null); setFormData(f => ({ ...f, symptoms: '', duration: '', severity: '', bodyArea: '' })); }}
                disabled={isStreaming}
                style={{ background: 'white', color: isStreaming ? '#94a3b8' : '#0f172a', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '14px 28px', fontWeight: '700', fontSize: '15px', cursor: isStreaming ? 'not-allowed' : 'pointer', transition: '0.2s', opacity: isStreaming ? 0.6 : 1 }}
                onMouseOver={e => { if(!isStreaming) e.target.style.background = '#f8fafc'; }}
                onMouseOut={e => { if(!isStreaming) e.target.style.background = 'white'; }}
              >
                Check New Symptoms
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      <footer style={{ background: '#0c1f35', color: '#94a3b8', padding: '64px 24px 40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <MedCheckLogo size="sm" showSubtitle={false} darkTheme={true} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>Intelligent health insights connecting patients with verified medical professionals.</p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Product</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'AI Symptom Analysis', path: '/product/symptom-analysis' },
                  { name: 'Health Insights', path: '/product/health-insights' },
                  { name: 'Nearby Doctor Suggestions', path: '/product/doctor-suggestions' },
                  { name: 'Personal Health History', path: '/product/health-history' }
                ].map(l => (
                  <li key={l.name}>
                    <Link to={l.path} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 16, fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Legal</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Symptoms Library', path: '/symptoms' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Service', path: '/terms-of-service' },
                  { name: 'Medical Disclaimer', path: '/medical-disclaimer' },
                  { name: 'Cookie Policy', path: '/cookie-policy' }
                ].map(l => (
                  <li key={l.name}>
                    <Link to={l.path} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#38BDF8'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: 13 }}>
            <p style={{ margin: 0 }}>© 2026 MedCheck. All rights reserved. This is a health informational tool — not a substitute for medical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Form Input Helper Components ────────────────────────── */

function InputBox({ icon, label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', display: 'block', fontSize: '14px' }}>
        {label}
      </label>
      <div
        className="input-container"
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          border: error ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
          borderRadius: '16px', padding: '16px', background: props.disabled ? '#f8fafc' : 'white',
          boxSizing: 'border-box'
        }}
      >
        {icon}
        <input {...props} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', color: '#0f172a', padding: 0 }} />
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>{error}</p>}
    </div>
  );
}

export default SymptomChecker;