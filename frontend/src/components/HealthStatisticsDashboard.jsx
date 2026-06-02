// frontend/src/components/HealthStatisticsDashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getDashboardStatistics, getHealthMetrics, clearStatisticsCache } from '../services/statisticsService';
import SymptomFrequencyChart from './Charts/Symptomfrequencychart';
import UrgencyDistributionChart from './Charts/Urgencydistributionchart';
import ConditionTrendsChart from './Charts/Conditiontrendschart';
import MonthlyTrendsChart from './Charts/Monthlytrendschart';
import HealthInsightsCard from './Charts/Healthinsightscard';
import { 
  RefreshCw, Activity, AlertCircle, LayoutGrid, Heart, Eye, 
  Calendar, Layers, Clock, TrendingUp, Compass, Award, Moon, Footprints, Scale
} from 'lucide-react';

const statsStyles = `
  .tab-toggle-container {
    display: flex;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 12px;
    gap: 4px;
    width: fit-content;
  }
  .tab-toggle-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tab-toggle-btn.active {
    background: white;
    color: #0ea5e9;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
  }
  .metric-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .trend-filter-btn {
    padding: 6px 14px;
    border: 1.5px solid #e2e8f0;
    background: white;
    color: #64748b;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .trend-filter-btn.active {
    background: #e0f2fe;
    border-color: #0ea5e9;
    color: #0369a1;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .biometric-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
    transition: all 0.3s ease;
  }
  .biometric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(14, 165, 233, 0.08);
    border-color: rgba(14, 165, 233, 0.25);
  }
  .chart-card {
    background: white;
    border-radius: 24px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
  }
  .chart-selector-container {
    display: flex;
    flex-wrap: wrap;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 14px;
    gap: 6px;
    width: fit-content;
  }
  .chart-selector-btn {
    padding: 10px 18px;
    border: none;
    background: transparent;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chart-selector-btn:hover {
    color: #0f172a;
    background: rgba(14, 165, 233, 0.04);
  }
  .chart-selector-btn.active {
    background: white;
    color: #0ea5e9;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
  }
  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 16px;
    padding: 18px 24px;
    color: #0369a1;
    font-size: 14px;
    line-height: 1.6;
  }
  .insight-explanation-card {
    background: #f8fafc;
    border-radius: 20px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    margin-top: 16px;
  }
`;

const HealthStatisticsDashboard = () => {
  const [subTab, setSubTab] = useState('biometrics'); // 'biometrics' | 'symptoms'
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [selectedChart, setSelectedChart] = useState('score'); // 'score' | 'pulse' | 'bp' | 'sleep' | 'weight'
  
  const [statistics, setStatistics] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, metricsRes] = await Promise.all([
        getDashboardStatistics(),
        getHealthMetrics()
      ]);
      
      if (statsRes.success) {
        setStatistics(statsRes.data);
      } else {
        throw new Error(statsRes.message || 'Failed to fetch statistics');
      }

      if (metricsRes.success) {
        setMetrics(metricsRes.metrics || []);
      } else {
        throw new Error(metricsRes.message || 'Failed to fetch health metrics');
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard statistics/metrics:', err);
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

  // Grouping helper functions
  const getWeekKey = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getMonthKey = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  };

  const getYearKey = (dateStr) => {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  const getAggregatedData = () => {
    if (!metrics || metrics.length === 0) return [];
    
    if (timeframe === 'daily') {
      return metrics.slice(-10).map(m => ({
        ...m,
        label: new Date(m.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        systolic: m.bloodPressure?.systolic || 120,
        diastolic: m.bloodPressure?.diastolic || 80
      }));
    }

    const groups = {};
    metrics.forEach(m => {
      let key;
      if (timeframe === 'weekly') {
        key = getWeekKey(m.date);
      } else if (timeframe === 'monthly') {
        key = getMonthKey(m.date);
      } else {
        key = getYearKey(m.date);
      }

      if (!groups[key]) {
        groups[key] = {
          label: key,
          heartRateSum: 0,
          systolicSum: 0,
          diastolicSum: 0,
          weightSum: 0,
          sleepDurationSum: 0,
          activityLevelSum: 0,
          healthScoreSum: 0,
          bmiSum: 0,
          count: 0
        };
      }

      groups[key].heartRateSum += m.heartRate || 0;
      groups[key].systolicSum += m.bloodPressure?.systolic || 0;
      groups[key].diastolicSum += m.bloodPressure?.diastolic || 0;
      groups[key].weightSum += m.weight || 0;
      groups[key].sleepDurationSum += m.sleepDuration || 0;
      groups[key].activityLevelSum += m.activityLevel || 0;
      groups[key].healthScoreSum += m.healthScore || 0;
      groups[key].bmiSum += m.bmi || 0;
      groups[key].count += 1;
    });

    return Object.values(groups).map(g => ({
      label: g.label,
      heartRate: Math.round(g.heartRateSum / g.count),
      systolic: Math.round(g.systolicSum / g.count),
      diastolic: Math.round(g.diastolicSum / g.count),
      weight: parseFloat((g.weightSum / g.count).toFixed(1)),
      sleepDuration: parseFloat((g.sleepDurationSum / g.count).toFixed(1)),
      activityLevel: Math.round(g.activityLevelSum / g.count),
      healthScore: Math.round(g.healthScoreSum / g.count),
      bmi: parseFloat((g.bmiSum / g.count).toFixed(1))
    })).slice(-10); // Limit to top 10 intervals
  };

  const getLatestMetric = () => {
    if (!metrics || metrics.length === 0) return null;
    return metrics[metrics.length - 1];
  };

  // Classifications helpers
  const getHeartRateClass = (hr) => {
    if (!hr) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (hr < 60) return { label: 'Low (Bradycardia)', bg: '#fef9c3', color: '#854d0e' };
    if (hr <= 100) return { label: 'Normal', bg: '#dcfce7', color: '#166534' };
    return { label: 'High (Tachycardia)', bg: '#fee2e2', color: '#991b1b' };
  };

  const getBPClass = (sys, dia) => {
    if (!sys || !dia) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (sys < 120 && dia < 80) return { label: 'Normal', bg: '#dcfce7', color: '#166534' };
    if (sys >= 120 && sys <= 129 && dia < 80) return { label: 'Elevated', bg: '#fef9c3', color: '#854d0e' };
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return { label: 'Hypertension Stage 1', bg: '#ffedd5', color: '#9a3412' };
    if (sys >= 180 || dia >= 120) return { label: 'BP Crisis 🚨', bg: '#fee2e2', color: '#991b1b' };
    if (sys >= 140 || dia >= 90) return { label: 'Hypertension Stage 2', bg: '#fee2e2', color: '#991b1b' };
    return { label: 'Hypertension Stage 2', bg: '#fee2e2', color: '#991b1b' };
  };

  const getBMIClass = (bmi) => {
    if (!bmi) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (bmi < 18.5) return { label: 'Underweight', bg: '#fef9c3', color: '#854d0e' };
    if (bmi < 25) return { label: 'Normal weight', bg: '#dcfce7', color: '#166534' };
    if (bmi < 30) return { label: 'Overweight', bg: '#ffedd5', color: '#9a3412' };
    return { label: 'Obese', bg: '#fee2e2', color: '#991b1b' };
  };

  const getSleepClass = (hrs) => {
    if (!hrs) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (hrs < 7) return { label: 'Insufficient', bg: '#fef9c3', color: '#854d0e' };
    if (hrs <= 9) return { label: 'Optimal', bg: '#dcfce7', color: '#166534' };
    return { label: 'Excessive', bg: '#fef9c3', color: '#854d0e' };
  };

  const getStepsClass = (steps) => {
    if (!steps) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (steps < 5000) return { label: 'Sedentary', bg: '#fee2e2', color: '#991b1b' };
    if (steps < 7500) return { label: 'Moderate', bg: '#fef9c3', color: '#854d0e' };
    if (steps < 10000) return { label: 'Active', bg: '#dcfce7', color: '#166534' };
    return { label: 'Highly Active', bg: '#e0f2fe', color: '#0369a1' };
  };

  const getHealthScoreClass = (score) => {
    if (!score) return { label: 'No Data', bg: '#f1f5f9', color: '#64748b' };
    if (score < 60) return { label: 'Needs Focus', bg: '#fee2e2', color: '#991b1b' };
    if (score < 80) return { label: 'Good', bg: '#fef9c3', color: '#854d0e' };
    return { label: 'Excellent', bg: '#dcfce7', color: '#166534' };
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const diff = Date.now() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return lastUpdated.toLocaleDateString();
  };

  // Render Loader
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
        <style>{statsStyles}</style>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #f3f3f3', borderTop: '4px solid #0ea5e9', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#0f172a' }}>Analyzing Health Data...</p>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>Aggregating biometric logs and symptom analysis history...</p>
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

  const latest = getLatestMetric();
  const aggregatedData = getAggregatedData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{statsStyles}</style>

      {/* Control Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 24px', borderRadius: '20px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '16px' }}>
        {/* Sub-tabs toggles */}
        <div className="tab-toggle-container">
          <button 
            className={`tab-toggle-btn ${subTab === 'biometrics' ? 'active' : ''}`}
            onClick={() => setSubTab('biometrics')}
          >
            <Activity size={16} /> Biometric Trends
          </button>
          <button 
            className={`tab-toggle-btn ${subTab === 'symptoms' ? 'active' : ''}`}
            onClick={() => setSubTab('symptoms')}
          >
            <Layers size={16} /> Symptom Analytics
          </button>
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Updated: <strong style={{ color: '#0ea5e9' }}>{formatLastUpdated()}</strong>
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Data Source Explanation Banner */}
      <div className="info-banner">
        <Compass size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>About Your Health Data:</strong> This dashboard compiles your live health statistics. If you have not logged biometric stats recently, the system generates a simulated 30-day baseline matching your height and weight parameters to prevent blank states. As you log new daily metrics or complete symptom screenings, this page updates in real time with your actual records.
        </div>
      </div>

      {/* ==================== BIOMETRIC TRENDS ==================== */}
      {subTab === 'biometrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Latest Biometric Summary Cards */}
          {latest ? (
            <div>
              <h2 style={{ fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>Current Biometric Reading</h2>
              
              <div className="grid-3">
                
                {/* Health Score */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#10b981', background: '#dcfce7', padding: '8px', borderRadius: '10px' }}><Award size={20} /></div>
                    {(() => {
                      const cl = getHealthScoreClass(latest.healthScore);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Overall Health Score</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{latest.healthScore || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>/ 100</span>
                  </div>
                </div>

                {/* Heart Rate */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #ef4444' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#ef4444', background: '#fee2e2', padding: '8px', borderRadius: '10px' }}><Heart size={20} /></div>
                    {(() => {
                      const cl = getHeartRateClass(latest.heartRate);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Pulse Rate</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{latest.heartRate || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>bpm</span>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#3b82f6', background: '#dbeafe', padding: '8px', borderRadius: '10px' }}><Activity size={20} /></div>
                    {(() => {
                      const cl = getBPClass(latest.bloodPressure?.systolic, latest.bloodPressure?.diastolic);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Blood Pressure</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>
                      {latest.bloodPressure?.systolic || '—'}/{latest.bloodPressure?.diastolic || '—'}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>mmHg</span>
                  </div>
                </div>

                {/* Sleep Duration */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #6366f1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#6366f1', background: '#e0e7ff', padding: '8px', borderRadius: '10px' }}><Moon size={20} /></div>
                    {(() => {
                      const cl = getSleepClass(latest.sleepDuration);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Sleep Duration</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{latest.sleepDuration || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>hours</span>
                  </div>
                </div>

                {/* Activity steps */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#f59e0b', background: '#fef3c7', padding: '8px', borderRadius: '10px' }}><Footprints size={20} /></div>
                    {(() => {
                      const cl = getStepsClass(latest.activityLevel);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Daily Activity</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>
                      {latest.activityLevel ? latest.activityLevel.toLocaleString() : '—'}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>steps</span>
                  </div>
                </div>

                {/* Weight & BMI */}
                <div className="biometric-card" style={{ borderLeft: '4px solid #14b8a6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ color: '#14b8a6', background: '#ccfbf1', padding: '8px', borderRadius: '10px' }}><Scale size={20} /></div>
                    {(() => {
                      const cl = getBMIClass(latest.bmi);
                      return <span className="metric-badge" style={{ background: cl.bg, color: cl.color }}>{cl.label}</span>
                    })()}
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Weight / BMI</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{latest.weight || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>kg <span style={{ fontSize: '12px', color: '#94a3b8' }}>(BMI: {latest.bmi || '—'})</span></span>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '32px', borderRadius: '20px', textLight: 'center', color: '#64748b' }}>
              No logged biometric data yet. Use the "Log Daily Metrics" button on the Overview page to record your stats.
            </div>
          )}

          {/* Timeframe selector & charts header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '28px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontFamily: "'Syne', sans-serif", fontWeight: '700', color: '#0f172a', margin: 0 }}>Biometric Historical Trends</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Select timeframe to aggregate your logged parameters.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {['daily', 'weekly', 'monthly', 'yearly'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`trend-filter-btn ${timeframe === t ? 'active' : ''}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Selector (Choose which metric to view) */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <div className="chart-selector-container">
              {[
                { id: 'score', label: 'Overall Score', icon: <Award size={15} /> },
                { id: 'pulse', label: 'Pulse Rate', icon: <Heart size={15} /> },
                { id: 'bp', label: 'Blood Pressure', icon: <Activity size={15} /> },
                { id: 'sleep', label: 'Sleep & Steps', icon: <Moon size={15} /> },
                { id: 'weight', label: 'Weight & BMI', icon: <Scale size={15} /> }
              ].map(c => (
                <button
                  key={c.id}
                  className={`chart-selector-btn ${selectedChart === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedChart(c.id)}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Biometrics Charts Display */}
          {aggregatedData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {selectedChart === 'score' && (
                <div className="chart-card">
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Health Score Progression</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Daily aggregated health metric calculations</p>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={aggregatedData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Area type="monotone" dataKey="healthScore" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Health Score" />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Plain-English medical explanation */}
                  <div className="insight-explanation-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={16} color="#10b981" /> Understanding Your Health Score
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                      The overall health score is a composite index computed daily from your sleep duration, physical activity (steps), and heart rate stability. A score above <strong>80/100</strong> represents excellent health habits, while scores below <strong>60</strong> suggest focusing on getting more rest or increasing physical activity.
                    </p>
                  </div>
                </div>
              )}

              {selectedChart === 'pulse' && (
                <div className="chart-card">
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Heart Rate Trends</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Aggregated pulse rate fluctuation (bpm)</p>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Heart Rate (bpm)" />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Plain-English medical explanation */}
                  <div className="insight-explanation-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Heart size={16} color="#ef4444" /> Understanding Heart Rate Trends
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                      Your resting pulse rate reflects cardiovascular fitness and overall heart health. A normal resting heart rate for adults ranges from <strong>60 to 100 beats per minute (bpm)</strong>. Consistent values within this range, or lower for active individuals, show a strong heart muscle. Spikes can indicate fever, stress, dehydration, or strenuous exertion.
                    </p>
                  </div>
                </div>
              )}

              {selectedChart === 'bp' && (
                <div className="chart-card">
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Blood Pressure Trends</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Systolic vs Diastolic parameters (mmHg)</p>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Legend />
                      <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Systolic (mmHg)" />
                      <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={2} name="Diastolic (mmHg)" />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Plain-English medical explanation */}
                  <div className="insight-explanation-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={16} color="#3b82f6" /> Understanding Blood Pressure
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                      Blood pressure consists of two values: <strong>Systolic</strong> (the top number measuring arterial pressure during heart beats) and <strong>Diastolic</strong> (the bottom number measuring resting pressure). Normal blood pressure is under <strong>120/80 mmHg</strong>. Stage 1 hypertension begins at 130/80 mmHg, while readings above 140/90 mmHg represent Stage 2.
                    </p>
                  </div>
                </div>
              )}

              {selectedChart === 'sleep' && (
                <div className="chart-card">
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Sleep vs Steps Activity</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Averages for daily sleep (hours) vs steps logged</p>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#6366f1" label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#6366f1'} }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#f59e0b" label={{ value: 'Steps', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#f59e0b'} }} />
                      <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar yAxisId="left" dataKey="sleepDuration" fill="#6366f1" radius={[4, 4, 0, 0]} name="Sleep (hrs)" maxBarSize={30} />
                      <Line yAxisId="right" type="monotone" dataKey="activityLevel" stroke="#f59e0b" strokeWidth={2.5} name="Activity (steps)" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Plain-English medical explanation */}
                  <div className="insight-explanation-card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Moon size={16} color="#6366f1" /> Understanding Sleep and Steps Activity
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                      Active days and restorative nights form the foundation of physical health. Adults should aim for <strong>7 to 9 hours of quality sleep</strong> nightly to support immune function and cellular repair. Similarly, maintaining a daily activity baseline of <strong>7,500 to 10,000 steps</strong> improves aerobic capacity and metabolic wellness.
                    </p>
                  </div>
                </div>
              )}

              {selectedChart === 'weight' && (
                <div className="chart-card">
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Weight & BMI Progress</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Weight variations with computed Body Mass Index over time</p>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={aggregatedData}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#14b8a6" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: {fontSize: 10, fill: '#14b8a6'} }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#0d9488" label={{ value: 'BMI', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#0d9488'} }} />
                      <Tooltip contentStyle={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" name="Weight (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#0ea5e9" strokeWidth={2} name="BMI Index" />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Plain-English medical explanation */}
                  <div className="insight-explanation-card" style={{ borderLeft: '4px solid #14b8a6' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scale size={16} color="#14b8a6" /> Understanding Weight & Body Mass Index
                    </h4>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                      Body Mass Index (BMI) is a standardized screening value calculated from your weight and height. A healthy BMI range for adults sits between <strong>18.5 and 24.9</strong>. BMI scores below 18.5 indicate underweight, 25 to 29.9 indicate overweight, and 30 or higher indicate obesity. Note that minor weight shifts are common due to hydration and nutrition.
                    </p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No aggregated biometric logs found.
            </div>
          )}

        </div>
      )}

      {/* ==================== SYMPTOM ANALYTICS ==================== */}
      {subTab === 'symptoms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Health Insights Cards Section */}
          {statistics?.insights && (
            <section className="animate-fade-in">
              <HealthInsightsCard insights={statistics.insights} />
            </section>
          )}

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '28px' }}>
            
            {/* Symptom Frequency Chart */}
            {statistics?.symptomFrequency && statistics.symptomFrequency.length > 0 ? (
              <div className="chart-card">
                <SymptomFrequencyChart data={statistics.symptomFrequency} />
              </div>
            ) : (
              <div className="chart-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '360px', color: '#64748b' }}>
                No symptom frequency logs available.
              </div>
            )}

            {/* Urgency Distribution Chart */}
            {statistics?.urgencyStats && (
              <div className="chart-card">
                <UrgencyDistributionChart data={statistics.urgencyStats} />
              </div>
            )}
          </div>

          {/* Condition Trends Chart - Full Width */}
          {statistics?.mostCommonConditions && statistics.mostCommonConditions.length > 0 && (
            <section className="chart-card">
              <ConditionTrendsChart data={statistics.mostCommonConditions} />
            </section>
          )}

          {/* Monthly Trends Chart - Full Width */}
          {statistics?.monthlyData && statistics.monthlyData.length > 0 && (
            <section className="chart-card">
              <MonthlyTrendsChart data={statistics.monthlyData} />
            </section>
          )}

        </div>
      )}

    </div>
  );
};

export default HealthStatisticsDashboard;