// frontend/src/components/MedicineInteractionChecker.jsx
import React, { useState, useEffect } from 'react';
import { lookupMedicineInfo, checkMedicineInteractions, getMyMedications } from '../services/medicineService';
import {
  Pill, Search, RefreshCw, AlertCircle, Info,
  CheckCircle2, XCircle, ShieldAlert, Thermometer,
  BookOpen, Clock, Zap, AlertTriangle,
  Activity, ChevronRight, Star, TrendingUp, Heart, Plus, Trash2
} from 'lucide-react';

/* ════════════════════════════════════════
   TAB DEFINITIONS FOR SINGLE DRUG LOOKUP
   ════════════════════════════════════════ */
const LOOKUP_TABS = [
  { id: 'overview',  label: 'Overview',      icon: <BookOpen    size={15} /> },
  { id: 'usage',     label: 'Uses & Dosage', icon: <Thermometer size={15} /> },
  { id: 'pros',      label: 'Pros & Cons',   icon: <TrendingUp  size={15} /> },
  { id: 'safety',    label: 'Safety',        icon: <ShieldAlert size={15} /> },
];

/* ════════════════════════════════════════
   SMALL REUSABLE PRIMITIVES
   ════════════════════════════════════════ */
const InfoRow = ({ label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '12px 0', borderBottom: '1px solid #f1f5f9',
  }}>
    <span style={{
      minWidth: '130px', fontSize: '11.5px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.05em',
      color: '#94a3b8', paddingTop: '2px',
    }}>{label}</span>
    <span style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.6, flex: 1 }}>{value}</span>
  </div>
);

const Chip = ({ label, color = '#0284c7', bg = '#e0f2fe', icon }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: bg, color, border: `1px solid ${color}22`,
    borderRadius: '8px', padding: '5px 12px',
    fontSize: '12.5px', fontWeight: '600', lineHeight: 1.4,
  }}>
    {icon && React.cloneElement(icon, { size: 11 })}
    {label}
  </span>
);

const ProConRow = ({ text, type }) => {
  const isPro = type === 'pro';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '10px 14px', borderRadius: '10px',
      background: isPro ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isPro ? '#bbf7d0' : '#fecaca'}`,
    }}>
      <span style={{
        marginTop: '2px', flexShrink: 0,
        color: isPro ? '#16a34a' : '#dc2626',
      }}>
        {isPro ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
      </span>
      <span style={{ fontSize: '13.5px', color: isPro ? '#14532d' : '#991b1b', lineHeight: 1.65 }}>
        {text}
      </span>
    </div>
  );
};

const SideEffectCard = ({ item, severity }) => {
  const isSerious = severity === 'serious';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '11px 14px', borderRadius: '10px',
      background: isSerious ? '#fff5f5' : '#fffbeb',
      borderLeft: `3px solid ${isSerious ? '#ef4444' : '#f59e0b'}`,
    }}>
      <AlertCircle size={14} color={isSerious ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: isSerious ? '#7f1d1d' : '#78350f', lineHeight: 1.55 }}>
        {item}
      </span>
    </div>
  );
};

const SafetyBlock = ({ icon, title, items = [], accent, bg }) => (
  <div style={{
    borderRadius: '14px', overflow: 'hidden',
    border: `1.5px solid ${accent}22`,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '12px 18px', background: bg,
    }}>
      <span style={{ color: accent }}>{icon}</span>
      <span style={{
        fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
        letterSpacing: '0.06em', color: accent,
      }}>{title}</span>
    </div>
    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'white' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <ChevronRight size={13} color={accent} style={{ marginTop: '3px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const getSeverityStyles = (severity) => {
  const sev = (severity || '').toLowerCase();
  if (sev.includes('critical')) {
    return {
      bg: '#fef2f2',
      border: '#fca5a5',
      text: '#b91c1c',
      badgeBg: '#fee2e2',
      badgeText: '#991b1b',
      iconColor: '#ef4444'
    };
  }
  if (sev.includes('high')) {
    return {
      bg: '#fff5f5',
      border: '#fecaca',
      text: '#c53030',
      badgeBg: '#ffe4e6',
      badgeText: '#9f1239',
      iconColor: '#f43f5e'
    };
  }
  if (sev.includes('mod')) {
    return {
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
      iconColor: '#f59e0b'
    };
  }
  return {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#15803d',
    badgeBg: '#dcfce7',
    badgeText: '#166534',
    iconColor: '#22c55e'
  };
};

/* ════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════ */
const MedicineInteractionChecker = () => {
  const [activeMode, setActiveMode] = useState('interaction'); // 'interaction' or 'lookup'

  // Lookup mode state
  const [lookupName, setLookupName] = useState('');
  const [lookupDetails, setLookupDetails] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupActiveTab, setLookupActiveTab] = useState('overview');

  // Interaction mode state
  const [inputMed, setInputMed] = useState('');
  const [medList, setMedList] = useState([]);
  const [profileMeds, setProfileMeds] = useState([]);
  const [checkAgainstProfile, setCheckAgainstProfile] = useState(true);
  const [interactionResult, setInteractionResult] = useState(null);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile medications on mount
  useEffect(() => {
    const fetchProfileMeds = async () => {
      try {
        const res = await getMyMedications();
        if (res.success && res.medications) {
          setProfileMeds(res.medications);
        }
      } catch (err) {
        console.warn('Failed to load profile medications:', err.message);
      }
    };
    fetchProfileMeds();
  }, []);

  // Handle single lookup submission
  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!lookupName.trim()) return;
    setLoading(true); setError(null); setLookupResult(null); setLookupActiveTab('overview');
    try {
      const res = await lookupMedicineInfo(lookupName.trim(), lookupDetails.trim());
      if (res.success) setLookupResult(res.medicine);
      else setError('Unable to retrieve medicine information.');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupReset = () => {
    setLookupName('');
    setLookupDetails('');
    setLookupResult(null);
    setError(null);
  };

  // Interaction checklist management
  const handleAddMed = (e) => {
    e.preventDefault();
    if (!inputMed.trim()) return;
    const med = inputMed.trim();
    if (!medList.some(m => m.toLowerCase() === med.toLowerCase())) {
      setMedList([...medList, med]);
    }
    setInputMed('');
  };

  const handleRemoveMed = (medToRemove) => {
    setMedList(medList.filter(m => m !== medToRemove));
  };

  const handleScreenInteractions = async (e) => {
    e.preventDefault();
    const effectiveMedsToCheck = [...medList];
    const hasProfileMeds = checkAgainstProfile && profileMeds.length > 0;

    if (effectiveMedsToCheck.length === 0 && !hasProfileMeds) {
      setError('Please add at least one medication to screen, or enable comparison against your health profile medications.');
      return;
    }
    if (effectiveMedsToCheck.length < 2 && !hasProfileMeds) {
      setError('Please add at least two medications to screen for interactions, or enable comparison against your profile medications.');
      return;
    }

    setLoading(true); setError(null); setInteractionResult(null);
    try {
      const res = await checkMedicineInteractions(effectiveMedsToCheck, checkAgainstProfile);
      if (res.success) {
        setInteractionResult(res);
      } else {
        setError('Unable to retrieve drug interactions.');
      }
    } catch (err) {
      setError(err.message || 'Failed to screen drug interactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInteractionReset = () => {
    setMedList([]);
    setInteractionResult(null);
    setError(null);
  };

  /* ── SINGLE LOOKUP TAB CONTENT RENDERER ── */
  const renderLookupTab = () => {
    const m = lookupResult;
    if (!m) return null;
    switch (lookupActiveTab) {
      case 'overview': return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {m.howItWorks && (
            <div style={{ background: '#f8faff', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid #e0f2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Zap size={16} color="#7c3aed" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7c3aed' }}>
                  Mechanism of Action
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: 1.8 }}>{m.howItWorks}</p>
            </div>
          )}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
            {m.category && <InfoRow label="Drug Category" value={m.category} />}
            {m.genericName && m.genericName !== m.name && <InfoRow label="Generic Name" value={m.genericName} />}
            {m.dosageInfo && <InfoRow label="Dosage" value={m.dosageInfo} />}
            {m.whenToTake && <InfoRow label="When to Take" value={m.whenToTake} />}
          </div>
        </div>
      );

      case 'usage': return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {m.usedFor?.length > 0 && (
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>
                Conditions & Indications
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {m.usedFor.map((c, i) => (
                  <Chip key={i} label={c} color="#0369a1" bg="#e0f2fe" icon={<Activity size={11} />} />
                ))}
              </div>
            </div>
          )}
          {m.dosageInfo && (
            <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid #bae6fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Pill size={15} color="#0284c7" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0284c7' }}>Dosage Information</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#0c4a6e', lineHeight: 1.75 }}>{m.dosageInfo}</p>
            </div>
          )}
          {m.whenToTake && (
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid #ddd6fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Clock size={15} color="#7c3aed" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7c3aed' }}>When & How to Take</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#3b0764', lineHeight: 1.75 }}>{m.whenToTake}</p>
            </div>
          )}
        </div>
      );

      case 'pros': return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={14} color="#16a34a" />
              </div>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#14532d', fontFamily: "'Syne', sans-serif" }}>Benefits (Pros)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(m.benefits || []).map((b, i) => <ProConRow key={i} text={b} type="pro" />)}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={14} color="#dc2626" />
              </div>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#991b1b', fontFamily: "'Syne', sans-serif" }}>Drawbacks (Cons)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(m.commonSideEffects || []).map((s, i) => <ProConRow key={i} text={s} type="con" />)}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', marginTop: '6px' }}>
              <Heart size={15} color="#e11d48" />
              <span style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e11d48' }}>
                Side Effects Breakdown
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: '11.5px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Common
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {(m.commonSideEffects || []).map((s, i) => <SideEffectCard key={i} item={s} severity="common" />)}
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: '11.5px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Serious
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {(m.seriousSideEffects || []).map((s, i) => <SideEffectCard key={i} item={s} severity="serious" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      case 'safety': return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {m.contraindications?.length > 0 && (
            <SafetyBlock
              icon={<XCircle size={15} />}
              title="Do NOT Use If"
              items={m.contraindications}
              accent="#dc2626"
              bg="#fef2f2"
            />
          )}
          {m.precautions?.length > 0 && (
            <SafetyBlock
              icon={<AlertTriangle size={15} />}
              title="Important Precautions"
              items={m.precautions}
              accent="#d97706"
              bg="#fffbeb"
            />
          )}
          {m.drugInteractionWarnings && (
            <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid #ddd6fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldAlert size={15} color="#7c3aed" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7c3aed' }}>Drug Interaction Warnings</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#4c1d95', lineHeight: 1.75 }}>{m.drugInteractionWarnings}</p>
            </div>
          )}
          {m.overdoseInfo && (
            <div style={{ background: '#fff1f2', borderRadius: '14px', padding: '20px 22px', border: '1.5px solid #fecdd3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={15} color="#e11d48" />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#e11d48' }}>Overdose — What to Do</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#881337', lineHeight: 1.75 }}>{m.overdoseInfo}</p>
            </div>
          )}
        </div>
      );

      default: return null;
    }
  };

  /* ════════ RENDER MAIN ════════ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .med-tab { transition: all 0.18s ease; }
        .med-tab:hover { background: #f1f5f9 !important; }
        .tag-remove:hover { color: #ef4444 !important; background: #fee2e2 !important; }
        .mode-btn:hover { background: #f8fafc; }
      `}</style>

      {/* ─── TOPO TAB SELECTOR MODE ─── */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '16px',
        padding: '6px',
        gap: '6px',
        border: '1px solid #cbd5e1'
      }}>
        <button
          onClick={() => { setActiveMode('interaction'); setError(null); }}
          className="mode-btn"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: activeMode === 'interaction' ? '700' : '600',
            background: activeMode === 'interaction' ? 'white' : 'transparent',
            color: activeMode === 'interaction' ? '#1e3a8a' : '#475569',
            boxShadow: activeMode === 'interaction' ? '0 4px 12px rgba(15,23,42,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          <ShieldAlert size={16} color={activeMode === 'interaction' ? '#1e3a8a' : '#64748b'} />
          Multi-Drug Interaction Screen
        </button>
        <button
          onClick={() => { setActiveMode('lookup'); setError(null); }}
          className="mode-btn"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: activeMode === 'lookup' ? '700' : '600',
            background: activeMode === 'lookup' ? 'white' : 'transparent',
            color: activeMode === 'lookup' ? '#1e3a8a' : '#475569',
            boxShadow: activeMode === 'lookup' ? '0 4px 12px rgba(15,23,42,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          <BookOpen size={16} color={activeMode === 'lookup' ? '#1e3a8a' : '#64748b'} />
          Drug Encyclopedia (Lookup)
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          MODE 1: MULTI-DRUG INTERACTION SCREEN
      ──────────────────────────────────────────────────────────────── */}
      {activeMode === 'interaction' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div className="profile-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #1e3a8a, #0d56a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(30,58,138,0.3)',
              }}>
                <ShieldAlert size={24} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
                  Drug Interaction Screen
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Analyze safety interactions between multiple medications instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddMed} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                Add Medication
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <div style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Search size={16} color="#94a3b8" />
                  </div>
                  <input
                    type="text"
                    value={inputMed}
                    onChange={(e) => setInputMed(e.target.value)}
                    placeholder="e.g. Aspirin, Warfarin, Ibuprofen..."
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !inputMed.trim()}
                  style={{
                    padding: '0 20px', borderRadius: '12px', border: 'none',
                    background: loading || !inputMed.trim() ? '#cbd5e1' : '#1e3a8a',
                    color: 'white', fontSize: '14px', fontWeight: '600',
                    cursor: loading || !inputMed.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </form>

            {/* Removable Tags List */}
            {medList.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                  Medications to Check ({medList.length})
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {medList.map((med, idx) => (
                    <span key={idx} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#f1f5f9', border: '1px solid #cbd5e1',
                      borderRadius: '8px', padding: '6px 12px', fontSize: '13px',
                      color: '#1e293b', fontWeight: '600'
                    }}>
                      <Pill size={12} color="#0284c7" />
                      {med}
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(med)}
                        className="tag-remove"
                        style={{
                          background: 'none', border: 'none', padding: '2px',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '4px', cursor: 'pointer', color: '#94a3b8',
                          marginLeft: '4px', transition: 'all 0.2s'
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Medications Inclusion Checkbox */}
            {profileMeds.length > 0 && (
              <div style={{
                background: '#f8fafc', border: '1.5px solid #e2e8f0',
                borderRadius: '14px', padding: '16px 20px', marginBottom: '24px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkAgainstProfile}
                    onChange={(e) => setCheckAgainstProfile(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                    Compare against medications in my health profile
                  </span>
                </label>
                {checkAgainstProfile && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '26px' }}>
                    {profileMeds.map((pm, idx) => (
                      <span key={idx} style={{
                        background: '#f5f3ff', border: '1px solid #ddd6fe',
                        borderRadius: '6px', padding: '3px 8px', fontSize: '12px',
                        color: '#6d28d9', fontWeight: '600'
                      }}>
                        {pm} (Profile)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Screen Button */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleScreenInteractions}
                disabled={loading || (medList.length === 0 && (!checkAgainstProfile || profileMeds.length === 0))}
                style={{
                  flex: 3, padding: '14px', borderRadius: '12px', border: 'none',
                  background: loading || (medList.length === 0 && (!checkAgainstProfile || profileMeds.length === 0))
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, #1e3a8a, #0284c7)',
                  color: 'white', fontSize: '15px', fontWeight: '600',
                  cursor: loading || (medList.length === 0 && (!checkAgainstProfile || profileMeds.length === 0)) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(30,58,138,0.2)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Screening Interactions...</>
                ) : (
                  <><ShieldAlert size={16} /> Screen Drug Interactions</>
                )}
              </button>
              {(medList.length > 0 || interactionResult) && (
                <button
                  type="button"
                  onClick={handleInteractionReset}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px',
                    border: '1.5px solid #cbd5e1', background: 'white',
                    fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {error && (
              <div style={{
                marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px',
                padding: '14px 18px', color: '#dc2626', fontSize: '13.5px', fontWeight: '500',
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>

          {/* SCREEN INTERACTION RESULTS */}
          {interactionResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', animation: 'fadeSlide 0.4s ease' }}>
              {/* Severity Banner */}
              {(() => {
                const styles = getSeverityStyles(interactionResult.overallSeverity);
                return (
                  <div style={{
                    borderRadius: '20px 20px 0 0',
                    background: styles.bg,
                    border: `1.5px solid ${styles.border}`,
                    borderBottom: 'none',
                    padding: '24px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <AlertTriangle size={28} color={styles.iconColor} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
                          Overall Risk: <span style={{ color: styles.text }}>{interactionResult.overallSeverity}</span>
                        </h3>
                        <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748b' }}>
                          Checked {interactionResult.medicinesChecked?.join(', ') || 'medications'}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'white', borderRadius: '12px', border: `1px solid ${styles.border}`,
                      padding: '8px 16px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Clinical Confidence
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0284c7' }}>
                        {interactionResult.confidenceScore || 85}%
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Advice Box and Detailed Warnings List */}
              <div style={{
                background: 'white',
                borderRadius: '0 0 20px 20px',
                border: '1.5px solid #cbd5e1',
                padding: '28px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {interactionResult.interactionsFound === 0 ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '30px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: '16px', textAlign: 'center', gap: '14px'
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a'
                    }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#14532d' }}>
                        No Dangerous Interactions Found
                      </h3>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#15803d', maxWidth: '480px', lineHeight: 1.6 }}>
                        {interactionResult.generalAdvice || 'The medications checked do not have any known dangerous drug-to-drug interactions. Ensure you consume them as directed.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Guidance */}
                    <div style={{
                      display: 'flex', gap: '12px', background: '#f8fafc',
                      border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px'
                    }}>
                      <Info size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
                          Pharmacist Guidance
                        </h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.65 }}>
                          {interactionResult.generalAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Detailed List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
                        Specific Interaction Warnings ({interactionResult.interactions?.length || 0})
                      </p>

                      {interactionResult.interactions?.map((item, idx) => {
                        const itemStyles = getSeverityStyles(item.severity);
                        return (
                          <div key={idx} style={{
                            border: `1.5px solid ${itemStyles.border}`,
                            borderRadius: '14px', overflow: 'hidden'
                          }}>
                            {/* Card Header */}
                            <div style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '12px 18px', background: itemStyles.bg, borderBottom: `1.5px solid ${itemStyles.border}`,
                              flexWrap: 'wrap', gap: '10px'
                            }}>
                              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Pill size={14} color="#64748b" />
                                {item.medicationA} <span style={{ color: '#94a3b8', fontWeight: '400' }}>+</span> {item.medicationB}
                              </span>
                              <span style={{
                                background: itemStyles.badgeBg, color: itemStyles.badgeText,
                                fontSize: '10px', fontWeight: '700', padding: '3px 10px',
                                borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em'
                              }}>
                                {item.severity}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>
                                {item.description}
                              </p>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                                {item.sideEffects?.length > 0 && (
                                  <div>
                                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                                      Side Effects
                                    </span>
                                    <ul style={{ margin: 0, paddingLeft: '14px', color: '#475569', fontSize: '12px', lineHeight: 1.7 }}>
                                      {item.sideEffects.map((se, i) => <li key={i}>{se}</li>)}
                                    </ul>
                                  </div>
                                )}
                                {item.precautions?.length > 0 && (
                                  <div>
                                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                                      Precautions
                                    </span>
                                    <ul style={{ margin: 0, paddingLeft: '14px', color: '#475569', fontSize: '12px', lineHeight: 1.7 }}>
                                      {item.precautions.map((pr, i) => <li key={i}>{pr}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div style={{
                display: 'flex', gap: '12px', background: '#fffbeb',
                border: '1.5px solid #fde68a', borderRadius: '16px',
                padding: '16px 20px', marginTop: '16px',
              }}>
                <Info size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
                  <strong>Disclaimer:</strong> This screening tool highlights potential safety interactions only. It does not replace professional medical evaluations. Always confirm medications with your healthcare team.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────
          MODE 2: SINGLE DRUG ENCYCLOPEDIA LOOKUP
      ──────────────────────────────────────────────────────────────── */}
      {activeMode === 'lookup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div className="profile-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(14,165,233,0.3)',
              }}>
                <Pill size={24} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
                  Medicine Encyclopedia
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  AI-powered comprehensive medicine information
                </p>
              </div>
            </div>

            <form onSubmit={handleLookupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                  Medicine Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Search size={16} color="#94a3b8" />
                  </div>
                  <input
                    type="text"
                    value={lookupName}
                    onChange={(e) => setLookupName(e.target.value)}
                    placeholder="e.g. Ibuprofen, Metformin, Amoxicillin..."
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '7px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                  Additional Details <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optional)</span>
                </label>
                <textarea
                  value={lookupDetails}
                  onChange={(e) => setLookupDetails(e.target.value)}
                  placeholder="e.g. I have diabetes and am 55 years old, looking for information on managing blood sugar..."
                  rows={2}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '13.5px',
                    color: '#334155', resize: 'vertical', fontFamily: 'inherit',
                    lineHeight: 1.6, boxSizing: 'border-box', background: '#fafcff',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={loading || !lookupName.trim()}
                  style={{
                    flex: 3, padding: '14px', borderRadius: '12px', border: 'none',
                    background: loading || !lookupName.trim()
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    color: 'white', fontSize: '15px', fontWeight: '600',
                    cursor: loading || !lookupName.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: loading || !lookupName.trim() ? 'none' : '0 8px 24px rgba(14,165,233,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Medicine...</>
                  ) : (
                    <><BookOpen size={16} /> Get Medicine Info</>
                  )}
                </button>
                {lookupResult && (
                  <button
                    type="button"
                    onClick={handleLookupReset}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px',
                      border: '1.5px solid #cbd5e1', background: 'white',
                      fontSize: '14px', fontWeight: '600', color: '#64748b', cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div style={{
                marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px',
                padding: '14px 18px', color: '#dc2626', fontSize: '13.5px', fontWeight: '500',
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>

          {/* LOOKUP RESULTS */}
          {lookupResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', animation: 'fadeSlide 0.4s ease' }}>
              <div style={{
                borderRadius: '20px 20px 0 0',
                background: 'white',
                padding: '32px 36px 24px',
                borderBottom: '1.5px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    {lookupResult.category && (
                      <span style={{
                        display: 'inline-block', background: '#e0f2fe',
                        borderRadius: '999px', padding: '4px 14px', fontSize: '11px',
                        fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: '#0369a1', marginBottom: '12px', border: '1px solid #bae6fd',
                      }}>
                        {lookupResult.category}
                      </span>
                    )}
                    <h2 style={{ margin: '0 0 6px', fontSize: '30px', fontFamily: "'Syne', sans-serif", fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                      {lookupResult.name}
                    </h2>
                    {lookupResult.genericName && lookupResult.genericName !== lookupResult.name && (
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                        Generic: <strong style={{ color: '#334155' }}>{lookupResult.genericName}</strong>
                      </p>
                    )}
                  </div>

                  <div style={{
                    background: '#f0f9ff', borderRadius: '16px',
                    padding: '14px 20px', textAlign: 'center', border: '1.5px solid #bae6fd',
                  }}>
                    <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                      AI Confidence
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0284c7', lineHeight: 1 }}>
                      {lookupResult.confidenceScore}<span style={{ fontSize: '16px', color: '#64748b' }}>%</span>
                    </div>
                    <div style={{ width: '80px', height: '5px', background: '#e0f2fe', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${lookupResult.confidenceScore}%`, height: '100%', background: '#0ea5e9', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>

                <p style={{
                  margin: '20px 0 0', fontSize: '14px', lineHeight: 1.8, color: '#475569',
                  background: '#f8fafc', padding: '16px 20px', borderRadius: '14px',
                  border: '1.5px solid #f1f5f9',
                }}>
                  {lookupResult.overview}
                </p>
              </div>

              {/* TAB BAR FOR LOOKUP DETAILS */}
              <div style={{
                display: 'flex', background: '#f8fafc',
                borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
                overflowX: 'auto', gap: '2px', padding: '6px 8px',
              }}>
                {LOOKUP_TABS.map(tab => (
                  <button
                    key={tab.id}
                    className="med-tab"
                    onClick={() => setLookupActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: lookupActiveTab === tab.id ? '700' : '500',
                      background: lookupActiveTab === tab.id ? 'white' : 'transparent',
                      color: lookupActiveTab === tab.id ? '#0284c7' : '#64748b',
                      boxShadow: lookupActiveTab === tab.id ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                      whiteSpace: 'nowrap', transition: 'all 0.18s ease',
                      borderBottom: lookupActiveTab === tab.id ? '2px solid #0284c7' : '2px solid transparent',
                    }}
                  >
                    <span style={{ color: lookupActiveTab === tab.id ? '#0284c7' : '#94a3b8' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{
                background: 'white', borderRadius: '0 0 20px 20px',
                border: '1px solid #e2e8f0', borderTop: 'none',
                padding: '28px 30px',
              }}>
                {renderLookupTab()}
              </div>

              <div style={{
                display: 'flex', gap: '14px', background: '#fffbeb',
                border: '1.5px solid #fde68a', borderRadius: '16px',
                padding: '18px 22px', marginTop: '16px',
              }}>
                <Info size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '12.5px', color: '#92400e', lineHeight: 1.65 }}>
                  <strong>Medical Disclaimer:</strong> Information above is AI-generated for educational purposes only and does NOT constitute professional medical advice. Always consult a qualified physician or pharmacist.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicineInteractionChecker;
