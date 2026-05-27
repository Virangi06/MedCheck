import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Brain,
  HeartPulse,
  ShieldAlert,
  Pill,
  Activity,
  User,
  Calendar,
  Siren,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Leaf,
  Clock,
  BadgeAlert,
  MapPin,
  AlertTriangle,
} from '../components/MedIcon';

const API = 'http://localhost:5000/api';

function PatientDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('history');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchAnalyses();

  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching analysis history...');
      console.log('🔑 token present:', !!token);

      const res = await axios.get(`${API}/analysis/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ History response status:', res.status);
      console.log('✅ History response payload:', res.data);

      const data = res.data.analyses || [];
      setAnalyses(data);
      buildHealthProfile(data);
    } catch (err) {
      // axios error shape: err.response?.status / err.response?.data
      console.error('❌ Fetch history error:', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        data: err?.response?.data,
      });

      // Fallback to localStorage
      const localRaw = localStorage.getItem('analysisHistory');
      console.warn('⚠️ Falling back to localStorage analysisHistory. Raw value length:', localRaw?.length);

      const local = JSON.parse(localRaw || '[]');
      console.log('📦 local analyses count:', local.length);

      setAnalyses(local);
      buildHealthProfile(local);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: reads inputData first, falls back to flat fields on older records
  const buildHealthProfile = (data) => {
    if (!data || data.length === 0) return;
    const latest = data[0];
    setHealthProfile({
      age:         latest.inputData?.age         || latest.age         || '—',
      gender:      latest.inputData?.gender      || latest.gender      || '—',
      height:      latest.inputData?.height      || latest.height      || '—',
      weight:      latest.inputData?.weight      || latest.weight      || '—',
      diseases:    latest.inputData?.diseases    || latest.diseases    || 'None',
      medications: latest.inputData?.medications || latest.medications || 'None',
      allergies:   latest.inputData?.allergies   || latest.allergies   || 'None',
    });
  };

  if (!user) return null;

  // ✅ FIX: getResult reads result.* first, falls back to flat fields
  // This makes old AND new records display correctly
  const getResult = (item) => ({
    possibleCondition:    item.result?.possibleCondition    || item.possibleCondition    || '',
    conditionExplanation: item.result?.conditionExplanation || item.conditionExplanation || '',
    urgencyLevel:         item.result?.urgencyLevel         || item.urgencyLevel         || '',
    recommendedDoctor:    item.result?.recommendedDoctor    || item.recommendedDoctor    || '',
    recommendedSpecialist:item.result?.recommendedSpecialist|| item.recommendedSpecialist|| '',
    precautions:          item.result?.precautions          || item.precautions          || [],
    recommendedMedicines: item.result?.recommendedMedicines || item.recommendedMedicines || [],
    dietRecommendation:   item.result?.dietRecommendation   || item.dietRecommendation   || '',
    recoveryAdvice:       item.result?.recoveryAdvice       || item.recoveryAdvice       || '',
    emergencyWarning:     item.result?.emergencyWarning     || item.emergencyWarning     || '',
    whenToSeeDoctor:      item.result?.whenToSeeDoctor      || item.whenToSeeDoctor      || '',
    nearbyDoctors:        item.result?.nearbyDoctors        || item.nearbyDoctors        || [],
  });

  const getInput = (item) => ({
    symptoms:  item.inputData?.symptoms  || item.symptoms  || '',
    duration:  item.inputData?.duration  || item.duration  || '',
    severity:  item.inputData?.severity  || item.severity  || '',
    bodyArea:  item.inputData?.bodyArea  || item.bodyArea  || '',
  });

  const urgencyColor = (level) => {
    if (!level) return { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
    const l = level.toLowerCase();
    if (l === 'emergency') return { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' };
    if (l === 'high')      return { bg: '#fff7ed', text: '#9a3412', dot: '#f97316' };
    if (l === 'moderate')  return { bg: '#fefce8', text: '#854d0e', dot: '#eab308' };
    return                        { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
            👋 Welcome back, {user.name}
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
            Your personal health dashboard
          </p>
        </div>
        <button
          onClick={() => navigate('/symptom-checker')}
          style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 22px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Brain size={16} /> New Analysis
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Analyses', value: analyses.length, icon: <Brain size={20} color="#0284c7" />, bg: '#e0f2fe' },
            {
              label: 'Last Check',
              value: analyses[0] ? new Date(analyses[0].createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
              icon: <Clock size={20} color="#7c3aed" />, bg: '#ede9fe'
            },
            {
              label: 'High Urgency',
              value: analyses.filter(a => ['high','emergency'].includes((getResult(a).urgencyLevel || '').toLowerCase())).length || 'None',
              icon: <ShieldAlert size={20} color="#dc2626" />, bg: '#fee2e2'
            },
            {
              label: 'Conditions Found',
              value: [...new Set(analyses.map(a => getResult(a).possibleCondition).filter(Boolean))].length,
              icon: <Activity size={20} color="#059669" />, bg: '#d1fae5'
            },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ background: stat.bg, borderRadius: '8px', padding: '8px', display: 'flex' }}>{stat.icon}</div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
          {[
            { id: 'history', label: '📋 Analysis History' },
            { id: 'health',  label: '❤️ Health Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', fontFamily: 'inherit',
                background: activeTab === tab.id ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <Brain size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>Loading your analysis history...</p>
              </div>
            ) : analyses.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <Brain size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '8px' }}>No analyses yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Run your first AI symptom check to see results here.</p>
                <button onClick={() => navigate('/symptom-checker')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Check Symptoms Now →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analyses.map((item, idx) => {
                  const r   = getResult(item);
                  const inp = getInput(item);
                  const uc  = urgencyColor(r.urgencyLevel);
                  const isExpanded = expandedId === (item._id || idx);

                  return (
                    <div key={item._id || idx} style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

                      {/* CARD HEADER */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : (item._id || idx))}
                        style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                      >
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: uc.dot, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                              {r.possibleCondition || 'Analysis Result'}
                            </h3>
                            <span style={{ background: uc.bg, color: uc.text, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {r.urgencyLevel || 'N/A'}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                            🩺 {inp.symptoms || '—'} &nbsp;·&nbsp; ⏱ {inp.duration || '—'} &nbsp;·&nbsp;
                            📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                          </p>
                        </div>
                        <div style={{ color: '#94a3b8' }}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {/* EXPANDED DETAIL */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid #f1f5f9', padding: '24px', background: '#fafcff' }}>

                          {/* Explanation */}
                          {r.conditionExplanation && (
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                              <p style={{ margin: 0, color: '#1e40af', fontSize: '14px', lineHeight: '1.7' }}>{r.conditionExplanation}</p>
                            </div>
                          )}

                          {/* 4 key fields */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                            {[
                              { label: 'Doctor Type',   value: r.recommendedDoctor,    icon: <User size={14} /> },
                              { label: 'Specialist',    value: r.recommendedSpecialist, icon: <Stethoscope size={14} /> },
                              { label: 'Severity',      value: inp.severity,            icon: <BadgeAlert size={14} /> },
                              { label: 'Body Area',     value: inp.bodyArea,            icon: <Activity size={14} /> },
                            ].map((f, i) => (
                              <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>{f.icon} {f.label}</p>
                                <p style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{f.value || '—'}</p>
                              </div>
                            ))}
                          </div>

                          {/* Lists */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                            {r.precautions?.length > 0 && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={15} color="#0284c7" /> Precautions</h4>
                                <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: '1.9' }}>
                                  {r.precautions.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                            )}
                            {r.recommendedMedicines?.length > 0 && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Pill size={15} color="#0284c7" /> Medicines</h4>
                                <ul style={{ margin: 0, paddingLeft: '18px', color: '#475569', fontSize: '13px', lineHeight: '1.9' }}>
                                  {r.recommendedMedicines.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                              </div>
                            )}
                            {r.dietRecommendation && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Leaf size={15} color="#059669" /> Diet</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.dietRecommendation}</p>
                              </div>
                            )}
                            {r.recoveryAdvice && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><HeartPulse size={15} color="#dc2626" /> Recovery</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.recoveryAdvice}</p>
                              </div>
                            )}
                            {r.whenToSeeDoctor && (
                              <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} color="#7c3aed" /> When to See Doctor</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '13px', lineHeight: '1.7' }}>{r.whenToSeeDoctor}</p>
                              </div>
                            )}
                          </div>

                          {/* Emergency banner */}
                          {r.emergencyWarning && ['high','emergency'].includes((r.urgencyLevel || '').toLowerCase()) && (
                            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                              <Siren size={18} color="#dc2626" />
                              <p style={{ margin: 0, color: '#991b1b', fontSize: '13px', fontWeight: '600' }}>{r.emergencyWarning}</p>
                            </div>
                          )}

                          {/* Nearby Doctors */}
                          {r.nearbyDoctors?.length > 0 && (
                            <div>
                              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={15} color="#0284c7" /> Nearby Medical Facilities
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                {r.nearbyDoctors.map((doc, i) => (
                                  <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                                    <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{doc.name}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>{doc.type}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <MapPin size={14} color="#0284c7" />
                                      <span>{doc.address}</span>
                                    </p>

                                    <p style={{ margin: 0, fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>
                                      {typeof doc.distance === 'number' ? doc.distance.toFixed(1) : doc.distance} km away
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── HEALTH PROFILE TAB ── */}
        {activeTab === 'health' && (
          <div>
            {!healthProfile ? (
              <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <HeartPulse size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '8px' }}>No health data yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Complete a symptom check to populate your health profile.</p>
                <button onClick={() => navigate('/symptom-checker')} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Start Symptom Check →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>

                {/* Personal Info */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0' }}>
                  <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} color="#0284c7" /> Personal Information
                    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: '#94a3b8', background: '#f1f5f9', padding: '4px 10px', borderRadius: '999px' }}>From latest analysis</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                    {[
                      {
                        label: 'Age',
                        value: healthProfile.age ? `${healthProfile.age} yrs` : '—',
                        icon: <Activity size={22} color="#0284c7" />,
                      },
                      {
                        label: 'Gender',
                        value: healthProfile.gender || '—',
                        icon: <User size={22} color="#0ea5e9" />,
                      },
                      {
                        label: 'Height',
                        value: healthProfile.height ? `${healthProfile.height} cm` : '—',
                        icon: <Stethoscope size={22} color="#7c3aed" />,
                      },
                      {
                        label: 'Weight',
                        value: healthProfile.weight ? `${healthProfile.weight} kg` : '—',
                        icon: <Pill size={22} color="#059669" />,
                      },
                    ].map((f, i) => (

                      <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #f1f5f9' }}>
                        <p style={{ margin: '0 0 6px', fontSize: '20px' }}>{f.icon}</p>
                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{f.label}</p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {[
                    { label: 'Existing Diseases',    value: healthProfile.diseases,    icon: <ShieldAlert size={20} color="#dc2626" />, bg: '#fef2f2', border: '#fecaca' },
                    { label: 'Current Medications',  value: healthProfile.medications, icon: <Pill size={20} color="#7c3aed" />,       bg: '#f5f3ff', border: '#ddd6fe' },
                    { label: 'Allergies',            value: healthProfile.allergies,   icon: <AlertTriangle size={20} color="#d97706" />, bg: '#fffbeb', border: '#fde68a' },
                  ].map((f, i) => (
                    <div key={i} style={{ background: f.bg, borderRadius: '16px', padding: '22px', border: `1px solid ${f.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        {f.icon}
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{f.label}</h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{f.value}</p>
                    </div>
                  ))}
                </div>

                {/* All Conditions */}
                {analyses.length > 0 && (
                  <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={20} color="#059669" /> Conditions Across All Analyses
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {[...new Set(analyses.map(a => getResult(a).possibleCondition).filter(Boolean))].map((cond, i) => (
                        <span key={i} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: '600' }}>
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;