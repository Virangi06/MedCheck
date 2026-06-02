// frontend/src/components/MedicineInteractionChecker.jsx

import React, { useState, useEffect } from 'react';
import { checkMedicineInteractions, getMyMedications } from '../services/medicineService';
import { Pill, AlertTriangle, Plus, Trash2, CheckCircle2, ShieldAlert, AlertCircle, RefreshCw, Info, HeartPulse, Award } from 'lucide-react';

const MedicineInteractionChecker = () => {
  const [profileMeds, setProfileMeds] = useState([]);
  const [inputMed, setInputMed] = useState('');
  const [medsList, setMedsList] = useState([]);
  const [includeProfile, setIncludeProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileMeds();
  }, []);

  const fetchProfileMeds = async () => {
    try {
      const response = await getMyMedications();
      if (response.success) {
        setProfileMeds(response.medications || []);
      }
    } catch (err) {
      console.warn('Failed to fetch profile meds:', err.message);
    }
  };

  const handleAddMed = (e) => {
    e.preventDefault();
    const trimmed = inputMed.trim();
    if (!trimmed) return;

    // Avoid duplicates
    if (
      medsList.some((m) => m.toLowerCase() === trimmed.toLowerCase()) ||
      (includeProfile && profileMeds.some((m) => m.toLowerCase() === trimmed.toLowerCase()))
    ) {
      setError('Medicine already added');
      return;
    }

    setMedsList([...medsList, trimmed]);
    setInputMed('');
    setError(null);
  };

  const handleRemoveMed = (index) => {
    setMedsList(medsList.filter((_, i) => i !== index));
    setResults(null);
  };

  const handleCheck = async () => {
    const allChecked = [...medsList];
    if (includeProfile) {
      allChecked.push(...profileMeds);
    }

    if (allChecked.length < 1) {
      setError('Please add at least 1 medication to check.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await checkMedicineInteractions(medsList, includeProfile);
      if (response.success) {
        setResults(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to check interactions');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setMedsList([]);
    setResults(null);
    setError(null);
  };

  const getSeverityStyles = (severity) => {
    const s = (severity || '').toLowerCase();
    if (s.includes('critical') || s.includes('danger')) {
      return { main: '#dc2626', bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
    }
    if (s.includes('high') || s.includes('warn')) {
      return { main: '#f97316', bg: '#fff7ed', border: '#ffedd5', text: '#9a3412' };
    }
    if (s.includes('moderate')) {
      return { main: '#d97706', bg: '#fffbeb', border: '#fef3c7', text: '#92400e' };
    }
    // Low risk or safe
    return { main: '#166534', bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d' };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
      
      {/* Search / Input Card */}
      <div className="profile-card" style={{ padding: '32px' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Pill size={22} color="#0284c7" /> Medicine Interaction Checker
        </h2>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
          Input one or more medications to analyze potential side effects, contraindications, and drug interactions. The check includes cross-referencing with your lifestyle history.
        </p>

        {/* Input Form */}
        <form onSubmit={handleAddMed} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            value={inputMed}
            onChange={(e) => setInputMed(e.target.value)}
            placeholder="e.g. Ibuprofen, Aspirin, Albuterol..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              padding: '0 20px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
              fontSize: '14px'
            }}
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {/* Checkbox for Profile meds */}
        {profileMeds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', background: '#f8fafc', padding: '12px 18px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <input
              type="checkbox"
              id="includeProfile"
              checked={includeProfile}
              onChange={(e) => {
                setIncludeProfile(e.target.checked);
                setResults(null);
              }}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0ea5e9' }}
            />
            <label htmlFor="includeProfile" style={{ fontSize: '13px', fontWeight: '500', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Include medications from my health profile <span style={{ color: '#0284c7', fontWeight: '700' }}>({profileMeds.join(', ')})</span>
            </label>
          </div>
        )}

        {/* Medications List tags */}
        {(medsList.length > 0 || (includeProfile && profileMeds.length > 0)) && (
          <div style={{ marginBottom: '30px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medications to check:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              
              {/* Profile Medications */}
              {includeProfile && profileMeds.map((med, idx) => (
                <span
                  key={`profile-${idx}`}
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    border: '1px solid #bae6fd',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Pill size={12} /> {med} <span style={{ fontSize: '10px', background: '#0284c7', color: 'white', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Profile</span>
                </span>
              ))}

              {/* Manually Added Medications */}
              {medsList.map((med, idx) => (
                <span
                  key={`added-${idx}`}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {med}
                  <button
                    type="button"
                    onClick={() => handleRemoveMed(idx)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px', borderRadius: '50%' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCheck}
            disabled={loading || (medsList.length === 0 && (!includeProfile || profileMeds.length === 0))}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Analyzing Interactions...
              </>
            ) : (
              <>
                <ShieldAlert size={16} /> Check Interactions & Side Effects
              </>
            )}
          </button>
          {medsList.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                fontSize: '15px',
                fontWeight: '600',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Clear List
            </button>
          )}
        </div>

        {error && (
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Overall Health Checker Summary Card */}
          <div className="profile-card" style={{ padding: '28px', borderLeft: `6px solid ${getSeverityStyles(results.overallSeverity).main}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
                  Interaction Screening Result
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
                  Overall Status: <span style={{ color: getSeverityStyles(results.overallSeverity).main }}>{results.overallSeverity}</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>AI Confidence Score</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#0284c7' }}>{results.confidenceScore}%</span>
                <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '10px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${results.confidenceScore}%`, height: '100%', background: '#0ea5e9', borderRadius: '10px' }} />
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.7, background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              💬 <strong>AI Pharmacist Summary:</strong> {results.generalAdvice || 'Clinical analysis complete.'}
            </p>
          </div>

          {results.interactionsFound === 0 ? (
            /* Safe Result Card */
            <div className="profile-card" style={{ borderLeft: '6px solid #22c55e', background: '#f0fdf4', padding: '24px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#14532d' }}>No Interactions Detected</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#166534', lineHeight: 1.6 }}>
                    No dangerous interactions were found between {results.medicinesChecked.join(', ')}. Keep in mind that individual clinical circumstances differ. Refer to precautions below.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Warnings / Dangerous Interactions Card */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>
                ⚠️ Clinical Findings ({results.interactionsFound})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {results.interactions.map((interaction, idx) => {
                  const styles = getSeverityStyles(interaction.severity);

                  return (
                    <div
                      key={idx}
                      className="profile-card"
                      style={{
                        padding: '24px',
                        borderLeft: `6px solid ${styles.main}`,
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.03)'
                      }}
                    >
                      {/* Interaction title & badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>
                          {interaction.medicationB && interaction.medicationB !== 'None' ? `${interaction.medicationA} + ${interaction.medicationB}` : interaction.medicationA}
                        </h4>
                        <span
                          style={{
                            background: styles.main,
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <AlertTriangle size={12} /> {interaction.severity}
                        </span>
                      </div>

                      {/* Description */}
                      <p style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
                        {interaction.description}
                      </p>

                      {/* Details Grid: Side Effects, Contraindications, Precautions */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        
                        {/* Side Effects */}
                        {interaction.sideEffects && interaction.sideEffects.length > 0 && (
                          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h5 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Side Effects</h5>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                              {interaction.sideEffects.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Contraindications */}
                        {interaction.contraindications && interaction.contraindications.length > 0 && (
                          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h5 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Contraindications</h5>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                              {interaction.contraindications.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Precautions */}
                        {interaction.precautions && interaction.precautions.length > 0 && (
                          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', gridColumn: 'span 1' }}>
                            <h5 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Actionable Precautions</h5>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                              {interaction.precautions.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Medical Disclaimer Banner */}
          <div style={{ display: 'flex', gap: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '20px 24px', marginTop: '10px' }}>
            <div style={{ color: '#d97706', marginTop: '2px' }}><Info size={20} /></div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Medical Disclaimer & Guidance
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#b45309', lineHeight: 1.6 }}>
                The interaction analysis above is generated by a combination of clinical guidelines and medical AI models. This screening tool is for educational and informational purposes only and does NOT constitute professional medical advice, diagnosis, or treatment. Always consult with a qualified physician or pharmacist before starting, changing, or stopping any medication regime.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default MedicineInteractionChecker;
