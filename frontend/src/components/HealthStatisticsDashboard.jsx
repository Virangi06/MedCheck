// frontend/src/components/HealthStatisticsDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getDashboardStatistics, clearStatisticsCache } from '../services/statisticsService';
import SymptomFrequencyChart from './Charts/Symptomfrequencychart';
import ConditionTrendsChart from './Charts/Conditiontrendschart';
import { 
  RefreshCw, AlertCircle, ShieldAlert, Activity, ClipboardList 
} from 'lucide-react';

const statsStyles = `
  .conclusion-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-radius: 24px;
    padding: 36px;
    color: white;
    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.15);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 32px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }
  .conclusion-card::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  @media (max-width: 768px) {
    .conclusion-card {
      grid-template-columns: 1fr;
      padding: 24px;
      gap: 20px;
    }
  }
  .conclusion-stat-box {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .conclusion-label {
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .conclusion-val {
    font-size: 16px;
    font-weight: 700;
    color: white;
    font-family: 'Syne', sans-serif;
  }
  .correlation-box {
    display: flex;
    align-items: start;
    gap: 16px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 20px;
    padding: 24px;
    color: #14532d;
    box-shadow: 0 8px 24px rgba(22, 163, 74, 0.02);
    font-family: 'DM Sans', sans-serif;
  }
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 32px;
  }
  @media (max-width: 991px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const HealthStatisticsDashboard = ({ healthProfile, analyses }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [analyses]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsRes = await getDashboardStatistics();
      if (statsRes.success) {
        setStatistics(statsRes.data);
      } else {
        throw new Error(statsRes.message || 'Failed to fetch statistics');
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      setError(err.message || 'Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await clearStatisticsCache();
      await fetchData();
    } catch (err) {
      setError('Failed to refresh statistics');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const diff = Date.now() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return lastUpdated.toLocaleDateString('en-IN');
  };

  // Render Loader
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '360px' }}>
        <style>{statsStyles}</style>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #f3f3f3', borderTop: '4px solid #0ea5e9', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#0f172a' }}>Compiling AI Analysis Conclusions...</p>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>Analyzing historical screenings and disease trends...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '24px', padding: '32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <style>{statsStyles}</style>
        <AlertCircle style={{ color: '#ef4444', marginBottom: '16px' }} size={48} />
        <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontSize: '18px', fontWeight: '700' }}>Failed to Load Dashboard Statistics</h3>
        <p style={{ margin: '0 0 20px', color: '#b91c1c', fontSize: '14px' }}>{error}</p>
        <button onClick={fetchData} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#dc2626', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  const hasAnalyses = statistics && statistics.totalAnalyses > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{statsStyles}</style>

      {/* Control Panel / Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 24px', borderRadius: '20px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '14px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'DM Sans', sans-serif" }}>
            ✦ Diagnostic Summary
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: "'DM Sans', sans-serif" }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Updated: <strong style={{ color: '#0ea5e9' }}>{formatLastUpdated()}</strong>
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Sync History'}
          </button>
        </div>
      </div>

      {!hasAnalyses ? (
        <div style={{ padding: '80px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: '#eff9ff', color: '#0ea5e9' }}>
            <ClipboardList size={40} />
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a' }}>No screening data logged yet</h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#64748b', maxWidth: '420px', lineHeight: 1.6 }}>
            Complete your first AI symptom checker assessment to generate detailed charts, condition trends, and clinical analytics.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 1. Symptom Screening Conclusion Card */}
          <div className="conclusion-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#38bdf8' }}>
                  AI Clinical Screening Conclusion
                </h3>
                <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: 1.5 }}>
                  This conclusion aggregates all symptom checks to identify predominant diagnostic trends and risks.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div className="conclusion-stat-box">
                  <span className="conclusion-label">Total Screenings</span>
                  <span className="conclusion-val">{statistics.totalAnalyses} completed</span>
                </div>
                <div className="conclusion-stat-box">
                  <span className="conclusion-label">Predominant Match</span>
                  <span className="conclusion-val">{statistics.insights.topCondition}</span>
                </div>
                <div className="conclusion-stat-box">
                  <span className="conclusion-label">Calculated Risk Level</span>
                  <span className="conclusion-val">{statistics.insights.riskLevel}</span>
                </div>
                <div className="conclusion-stat-box">
                  <span className="conclusion-label">Average Urgency</span>
                  <span className="conclusion-val">{statistics.insights.averageUrgencyLevel} Level</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
              <span className="conclusion-label" style={{ color: '#38bdf8' }}>AI Clinical Recommendation</span>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#e2e8f0', lineHeight: 1.6 }}>
                {statistics.insights.recommendedAction}
              </p>
            </div>
          </div>

          {/* 2. Disease / Profile Correlation Banner */}
          {healthProfile?.diseases && healthProfile.diseases.toLowerCase() !== 'none' && healthProfile.diseases.trim() !== '' && (
            <div className="correlation-box">
              <div style={{ color: '#16a34a', background: '#dcfce7', padding: '8px', borderRadius: '12px', flexShrink: 0 }}>
                <ShieldAlert size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#14532d' }}>
                  Risk Correlation: Profile Declared Diseases vs. Screened Conditions
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#166534', lineHeight: 1.6 }}>
                  You have recorded the following conditions in your profile: <strong style={{ textDecoration: 'underline' }}>{healthProfile.diseases}</strong>. 
                  Our models monitor for connections between these conditions and your screened condition (<strong>{statistics.insights.topCondition}</strong>) to identify potential complications or chronic symptom patterns.
                </p>
              </div>
            </div>
          )}

          {/* 3. Simplified Charts Grid */}
          <div className="charts-grid">
            <ConditionTrendsChart data={statistics.mostCommonConditions} />
            <SymptomFrequencyChart data={statistics.symptomFrequency} />
          </div>

        </div>
      )}

    </div>
  );
};

export default HealthStatisticsDashboard;