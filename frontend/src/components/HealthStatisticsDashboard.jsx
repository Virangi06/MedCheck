// frontend/src/components/HealthStatisticsDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getDashboardStatistics, clearStatisticsCache, getAIHealthAssessment } from '../services/statisticsService';
import SymptomFrequencyChart from './Charts/Symptomfrequencychart';
import {
  RefreshCw, AlertCircle, ShieldAlert, Activity, ClipboardList,
  Brain, Sparkles, ChevronDown, ChevronUp, CheckCircle2,
  XCircle, TrendingUp, Heart, Stethoscope, AlertTriangle, Info,
  BarChart3, Calendar, Zap,
} from 'lucide-react';

/* ══════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════ */
const S = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes fadeUp{
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
    50%      { box-shadow: 0 0 0 8px rgba(124,58,237,0.08); }
  }
  .stat-tile { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .stat-tile:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(15,23,42,0.09) !important; }
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    gap: 24px;
  }
  @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
  .assess-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 14px 36px rgba(124,58,237,0.38) !important; }
  .cond-row { transition: background 0.16s ease; }
  .cond-row:hover { background: #f5f3ff !important; }
`;

/* ── Mini stat tile ── */
const StatTile = ({ label, value, sub, accent, bg, icon }) => (
  <div className="stat-tile" style={{
    background: bg || 'white', borderRadius: '18px',
    padding: '20px 22px', border: `1.5px solid ${accent}22`,
    boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
    display: 'flex', flexDirection: 'column', gap: '10px',
  }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      background: `${accent}18`, color: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a',
        fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '11.5px', color: accent, fontWeight: '600', marginTop: '3px' }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

/* ── Likelihood badge ── */
const LBadge = ({ level }) => {
  const map = {
    high:     { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    moderate: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    low:      { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  };
  const s = map[(level || '').toLowerCase()] || map.low;
  return (
    <span style={{ padding: '2px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
      background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {level}
    </span>
  );
};

/* ── Health score ring ── */
const ScoreRing = ({ score, status }) => {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const statusColor = { Good: '#22c55e', Fair: '#f59e0b', Poor: '#ef4444', Critical: '#dc2626' };
  const R = 42, C = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '110px', height: '110px' }}>
        <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={R} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle cx="55" cy="55" r={R} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${(score / 100) * C} ${C}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: '12.5px', fontWeight: '700', color: statusColor[status] || '#64748b',
        background: `${statusColor[status] || '#64748b'}16`, padding: '4px 14px', borderRadius: '999px' }}>
        {status}
      </span>
    </div>
  );
};

/* ════════════════════════════════════════
   AI ASSESSMENT CARD
════════════════════════════════════════ */
const AIAssessmentCard = ({ totalAnalyses, lastUpdated }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const requestVersionRef           = React.useRef(0);

  const run = async () => {
    const version = ++requestVersionRef.current;
    setLoading(true); setError(null); setAssessment(null);
    try {
      const res = await getAIHealthAssessment();
      if (version !== requestVersionRef.current) return;
      if (res.success) {
        setAssessment(res.assessment);
      } else {
        setError(res.message || 'Assessment failed');
      }
    } catch (err) {
      if (version !== requestVersionRef.current) return;
      setError(err.message || 'Could not generate assessment');
    } finally {
      if (version === requestVersionRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (totalAnalyses > 0) {
      run();
    }
  }, [totalAnalyses, lastUpdated]);

  const hasData = totalAnalyses > 0;

  return (
    <div style={{
      borderRadius: '22px',
      overflow: 'hidden',
      border: '1.5px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
      background: 'white'
    }}>

      {/* Header */}
      <div style={{
        background: 'white',
        padding: '22px 24px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '13px',
            background: '#eff9ff',
            border: '1px solid #e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={22} color="#0ea5e9" />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontFamily: "'Syne',sans-serif",
              fontWeight: '800',
              color: '#0f172a'
            }}>AI Health Assessment</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              Deep analysis of your complete health history
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {hasData && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#eff9ff',
              border: '1px solid #e0f2fe',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#0ea5e9',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={12} />
              AI Synthesized
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ background: 'white', padding: '26px 28px' }}>

        {!hasData ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <ClipboardList size={40} color="#e2e8f0" style={{ marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '15px' }}>
              No analysis history yet. Run a symptom check first.
            </p>
          </div>
        ) : loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '52px',
            gap: '16px'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #0ea5e9',
              animation: 'spin 0.9s linear infinite'
            }} />
            <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>
              Analysing your health data…
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>This may take up to 30 seconds</p>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            gap: '14px',
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#991b1b', fontSize: '14px' }}>
                Assessment Failed
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#b91c1c' }}>{error}</p>
              <button onClick={run} style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#dc2626',
                color: 'white',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                Retry
              </button>
            </div>
          </div>
        ) : assessment ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeUp 0.4s ease' }}>

            {/* Score + summary */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <ScoreRing score={assessment.healthScore} status={assessment.overallHealthStatus} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{
                  margin: '0 0 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: '#0ea5e9'
                }}>
                  Health Situation Summary
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: 1.8,
                  background: '#f8fafc',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0'
                }}>
                  {assessment.summary}
                </p>
              </div>
            </div>

            {/* Symptoms & Disease Analysis Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Current Symptoms Column */}
              <div style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Activity size={16} color="#0ea5e9" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Current Health Symptoms</span>
                </div>
                {assessment.recurringSymptoms && assessment.recurringSymptoms.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {assessment.recurringSymptoms.map((s, i) => (
                      <span key={i} style={{
                        background: '#f1f5f9', color: '#475569', borderRadius: '8px',
                        padding: '6px 12px', fontSize: '13px', fontWeight: '600'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No recurring symptoms identified.</p>
                )}
              </div>

              {/* General Disease Analysis */}
              <div style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Stethoscope size={16} color="#0ea5e9" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>General Disease Analysis</span>
                </div>
                {assessment.probableConditions && assessment.probableConditions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {assessment.probableConditions.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '13.5px' }}>{c.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{c.reason}</p>
                        </div>
                        <LBadge level={c.likelihood} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No probable conditions analyzed.</p>
                )}
              </div>

            </div>

            {/* Recommended Next Steps */}
            {assessment.immediateActions?.length > 0 && (
              <div style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ShieldAlert size={16} color="#0ea5e9" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Clinical Recommendations</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {assessment.immediateActions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#0ea5e9', flexShrink: 0 }}>
                        {i + 1}.
                      </span>
                      <span style={{ fontSize: '13px', color: '#475569', lineHeight: 1.55 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{
              display: 'flex',
              gap: '10px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '13px 16px'
            }}>
              <Info size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', lineHeight: 1.65 }}>
                {assessment.disclaimer}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════ */
const HealthStatisticsDashboard = ({ healthProfile, analyses }) => {
  const [statistics, setStatistics]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { fetchData(); }, [analyses]);

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const res = await getDashboardStatistics();
      if (res.success) setStatistics(res.data);
      else throw new Error(res.message || 'Failed');
      setLastUpdated(new Date());
    } catch (err) { setError(err.message || 'Failed to load statistics.'); }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await clearStatisticsCache();
      await fetchData();
    } catch { setError('Failed to refresh'); }
    finally { setIsRefreshing(false); }
  };

  const fmtUpdated = () => {
    if (!lastUpdated) return 'Never';
    const m = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m} min ago`;
    return lastUpdated.toLocaleDateString('en-IN');
  };

  /* ── loading ── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px', background: 'white',
      borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '360px' }}>
      <style>{S}</style>
      <div style={{ width: '46px', height: '46px', borderRadius: '50%',
        border: '4px solid #f3f3f3', borderTop: '4px solid #0ea5e9',
        animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
      <p style={{ margin: 0, fontWeight: '700', fontSize: '17px', color: '#0f172a' }}>
        Compiling Statistics…
      </p>
      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
        Analysing historical screenings and disease trends
      </p>
    </div>
  );

  /* ── error ── */
  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5',
      borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
      <style>{S}</style>
      <AlertCircle color="#ef4444" size={48} style={{ marginBottom: '16px' }} />
      <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontSize: '18px', fontWeight: '700' }}>
        Failed to Load Statistics
      </h3>
      <p style={{ margin: '0 0 20px', color: '#b91c1c', fontSize: '14px' }}>{error}</p>
      <button onClick={fetchData} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none',
        background: '#dc2626', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
        Retry
      </button>
    </div>
  );

  const hasData = statistics && statistics.totalAnalyses > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{S}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', padding: '14px 24px', borderRadius: '18px',
        border: '1.5px solid #f1f5f9', flexWrap: 'wrap', gap: '12px',
        boxShadow: '0 2px 12px rgba(15,23,42,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={18} color="#0ea5e9" />
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a',
            fontFamily: "'Syne',sans-serif" }}>
            Diagnostic Statistics
          </span>
          <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1',
            padding: '3px 10px', borderRadius: '999px', fontWeight: '700' }}>
            {statistics?.totalAnalyses || 0} screenings
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Updated: <strong style={{ color: '#0ea5e9' }}>{fmtUpdated()}</strong>
          </span>
          <button onClick={handleRefresh} disabled={isRefreshing} style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
            borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white',
            color: '#475569', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer',
          }}>
            <RefreshCw size={13} style={isRefreshing ? { animation: 'spin 0.9s linear infinite' } : {}} />
            {isRefreshing ? 'Refreshing…' : 'Sync'}
          </button>
        </div>
      </div>

      {/* ── NO DATA ── */}
      {!hasData ? (
        <div style={{ padding: '80px 24px', background: 'white', border: '1.5px solid #f1f5f9',
          borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '18px', borderRadius: '20px', background: '#eff9ff', color: '#0ea5e9' }}>
            <ClipboardList size={40} />
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne',sans-serif",
            fontWeight: '700', color: '#0f172a' }}>
            No screening data yet
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#64748b', maxWidth: '420px', lineHeight: 1.6 }}>
            Complete your first AI symptom checker assessment to generate charts, condition trends, and clinical analytics.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* ── STAT TILES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
            <StatTile label="Total Screenings" value={statistics.totalAnalyses}
              sub="All time" accent="#0ea5e9" icon={<ClipboardList size={18} />} />
            <StatTile label="Top Condition" value={statistics.insights.topCondition || 'N/A'}
              sub="Most detected" accent="#0369a1" icon={<Stethoscope size={18} />} />
          </div>

          {/* ── RECOMMENDATION BANNER ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            background: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
            borderRadius: '20px', padding: '24px 28px', color: 'white',
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '13px',
              background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={20} color="white" />
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.65)' }}>
                AI Clinical Recommendation
              </p>
              <p style={{ margin: 0, fontSize: '14.5px', color: 'rgba(255,255,255,0.93)', lineHeight: 1.7 }}>
                {statistics.insights.recommendedAction}
              </p>
            </div>
          </div>

          {/* ── PROFILE CORRELATION ── */}
          {healthProfile?.diseases &&
            healthProfile.diseases.toLowerCase() !== 'none' &&
            healthProfile.diseases.trim() !== '' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px',
              background: '#eff9ff', border: '1.5px solid #e0f2fe', borderRadius: '18px', padding: '22px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#e0f2fe',
                color: '#0ea5e9', flexShrink: 0 }}>
                <ShieldAlert size={18} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#0369a1' }}>
                  Profile Disease Correlation
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>
                  Declared: <strong style={{ textDecoration: 'underline' }}>{healthProfile.diseases}</strong>{' '}
                  — AI monitors links with screened condition{' '}
                  (<strong>{statistics.insights.topCondition}</strong>) for chronic pattern detection.
                </p>
              </div>
            </div>
          )}

          {/* ── AI ASSESSMENT CARD ── */}
          <AIAssessmentCard totalAnalyses={statistics.totalAnalyses} lastUpdated={lastUpdated} />

          {/* ── CHARTS ── */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px',
            border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <BarChart3 size={16} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '15px', fontFamily: "'Syne',sans-serif",
                fontWeight: '700', color: '#0f172a' }}>
                Visual Analytics
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginLeft: '4px' }}>
                Based on {statistics.totalAnalyses} screenings
              </span>
            </div>
            <div style={{ width: '100%' }}>
              <SymptomFrequencyChart data={statistics.monthlyData} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default HealthStatisticsDashboard;