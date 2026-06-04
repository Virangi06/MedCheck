// frontend/components/Charts/HealthInsightsCard.jsx

import React from 'react';
import { 
  BarChart3, ShieldAlert, ShieldCheck, HeartPulse, Hospital, 
  Calendar, TrendingUp, Sparkles, AlertCircle, Info 
} from 'lucide-react';

/**
 * HealthInsightsCard Component
 * Displays key health insights and metrics in card format
 * 
 * Props:
 *  - insights: Object with {totalAnalyses, averageUrgencyLevel, riskLevel, topCondition, recommendedAction, trend}
 */
const HealthInsightsCard = ({ insights }) => {
  // Helper function to get color configuration for status levels
  const getStatusColors = (level) => {
    const l = level?.toLowerCase() || '';
    if (l.includes('emergency') || l.includes('critical')) {
      return {
        bg: '#FAF5FF',
        text: '#7C3AED',
        border: '#E9D5FF',
        iconBg: '#F3E8FF',
        glow: 'rgba(124, 58, 237, 0.08)',
        icon: ShieldAlert,
      };
    }
    if (l.includes('high') || l.includes('red') || l.includes('severe')) {
      return {
        bg: '#FEF2F2',
        text: '#DC2626',
        border: '#FCA5A5',
        iconBg: '#FEE2E2',
        glow: 'rgba(220, 38, 38, 0.08)',
        icon: AlertCircle,
      };
    }
    if (l.includes('moderate') || l.includes('yellow') || l.includes('warn')) {
      return {
        bg: '#FFFBEB',
        text: '#D97706',
        border: '#FDE68A',
        iconBg: '#FEF3C7',
        glow: 'rgba(217, 119, 6, 0.08)',
        icon: AlertCircle,
      };
    }
    // Low / Green
    return {
      bg: '#ECFDF5',
      text: '#059669',
      border: '#A7F3D0',
      iconBg: '#D1FAE5',
      glow: 'rgba(5, 150, 105, 0.08)',
      icon: ShieldCheck,
    };
  };

  // Default values if insights not provided
  const defaultInsights = {
    totalAnalyses: 0,
    averageUrgencyLevel: 'N/A',
    riskLevel: 'No Risk',
    mostRecentAnalysis: null,
    topCondition: 'No data',
    recommendedAction: 'No recommendation',
    trend: 'Stable'
  };

  const safeInsights = { ...defaultInsights, ...insights };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const urgencyColors = getStatusColors(safeInsights.averageUrgencyLevel);
  const riskColors = getStatusColors(safeInsights.riskLevel);
  
  // Recommendation colors
  const getRecommendationStyle = (rec) => {
    if (rec?.includes('🔴') || rec?.toLowerCase().includes('emergency') || rec?.toLowerCase().includes('immediate')) {
      return getStatusColors('high');
    }
    if (rec?.includes('🟡') || rec?.toLowerCase().includes('doctor') || rec?.toLowerCase().includes('check-up')) {
      return getStatusColors('moderate');
    }
    return getStatusColors('low');
  };
  const recColors = getRecommendationStyle(safeInsights.recommendedAction);
  const RecIcon = recColors.icon;

  const UrgencyIcon = urgencyColors.icon;
  const RiskIcon = riskColors.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .stats-card-premium {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 28px 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .stats-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
        }
        .icon-sq {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justifyContent: center;
          flex-shrink: 0;
        }
        .grid-premium-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .grid-premium-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .takeaway-list-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14.5px;
          color: #1e3a8a;
          line-height: 1.6;
        }
        .takeaway-bullet {
          color: #0ea5e9;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 4px;
        }
      `}</style>

      {/* Top Row: Stats Cards */}
      <div className="grid-premium-4">
        {/* Total Analyses Card */}
        <div className="stats-card-premium" style={{ borderLeft: '5px solid #0EA5E9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Analyses
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '36px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
                {safeInsights.totalAnalyses}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#64748b' }}>Health assessments completed</p>
            </div>
            <div className="icon-sq" style={{ background: '#EFF9FF', color: '#0ea5e9' }}>
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        {/* Average Urgency Card */}
        <div 
          className="stats-card-premium" 
          style={{ 
            borderLeft: `5px solid ${urgencyColors.border}`,
            background: urgencyColors.bg,
            boxShadow: `0 4px 20px ${urgencyColors.glow}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <p style={{ margin: 0, color: urgencyColors.text, opacity: 0.8, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Average Urgency
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: urgencyColors.text, lineHeight: 1 }}>
                {safeInsights.averageUrgencyLevel}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: '13px', color: urgencyColors.text, opacity: 0.8 }}>Across all symptom checks</p>
            </div>
            <div className="icon-sq" style={{ background: urgencyColors.iconBg, color: urgencyColors.text }}>
              <UrgencyIcon size={24} />
            </div>
          </div>
        </div>

        {/* Risk Level Card */}
        <div 
          className="stats-card-premium" 
          style={{ 
            borderLeft: `5px solid ${riskColors.border}`,
            background: riskColors.bg,
            boxShadow: `0 4px 20px ${riskColors.glow}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <p style={{ margin: 0, color: riskColors.text, opacity: 0.8, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Risk Level
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: '800', color: riskColors.text, lineHeight: 1.1 }}>
                {safeInsights.riskLevel}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: '13px', color: riskColors.text, opacity: 0.8 }}>Overall health evaluation</p>
            </div>
            <div className="icon-sq" style={{ background: riskColors.iconBg, color: riskColors.text }}>
              <RiskIcon size={24} />
            </div>
          </div>
        </div>

        {/* Top Condition Card */}
        <div className="stats-card-premium" style={{ borderLeft: '5px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ maxWidth: 'calc(100% - 60px)' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Condition
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '22px', fontWeight: '800', color: '#8b5cf6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {safeInsights.topCondition}
              </p>
              <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#64748b' }}>Most frequently matched</p>
            </div>
            <div className="icon-sq" style={{ background: '#F5F3FF', color: '#8b5cf6' }}>
              <Hospital size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Large Recommendation Card */}
      <div 
        className="stats-card-premium"
        style={{ 
          borderLeft: `6px solid ${recColors.border}`,
          background: recColors.bg,
          padding: '24px 28px',
          boxShadow: `0 8px 30px ${recColors.glow}`,
          flexDirection: 'row',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div className="icon-sq" style={{ width: '56px', height: '56px', borderRadius: '18px', background: recColors.iconBg, color: recColors.text }}>
          <RecIcon size={30} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: recColors.text, opacity: 0.8, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Health Recommendation
          </p>
          <p style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: '700', color: '#0f172a', lineHeight: 1.5 }}>
            {safeInsights.recommendedAction.replace(/[🔴🟡🟢]\s*/g, '')}
          </p>
        </div>
      </div>

      {/* Secondary Info Grid */}
      <div className="grid-premium-2">
        {/* Last Analysis Card */}
        <div className="stats-card-premium" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div className="icon-sq" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
            <Calendar size={22} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Last Assessment
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              {formatDate(safeInsights.mostRecentAnalysis)}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              {safeInsights.mostRecentAnalysis ? 'Assessment history active' : 'No analyses completed yet'}
            </p>
          </div>
        </div>

        {/* Trend Card */}
        <div className="stats-card-premium" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div className="icon-sq" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Health Trend
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              {safeInsights.trend.replace(/[📈📉➡️]\s*/g, '')}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              {safeInsights.trend.includes('📈') ? 'Increased check frequency' : 
               safeInsights.trend.includes('📉') ? 'Decreasing check frequency' : 'Consistent baseline pattern'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div 
        style={{ 
          background: '#EFF9FF', 
          border: '1.5px solid #BAE6FD', 
          borderRadius: '24px', 
          padding: '28px',
          boxShadow: '0 8px 30px rgba(14,165,233,0.03)'
        }}
      >
        <p style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} /> Analytical Insights & Takeaways
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {safeInsights.totalAnalyses > 0 && (
            <div className="takeaway-list-item">
              <span className="takeaway-bullet">✓</span>
              <span>You have completed <strong>{safeInsights.totalAnalyses}</strong> comprehensive health analyses.</span>
            </div>
          )}
          {safeInsights.averageUrgencyLevel !== 'N/A' && (
            <div className="takeaway-list-item">
              <span className="takeaway-bullet">✓</span>
              <span>Your average urgency rating is categorized as <strong>{safeInsights.averageUrgencyLevel} Risk</strong>.</span>
            </div>
          )}
          {safeInsights.topCondition !== 'No data' && (
            <div className="takeaway-list-item">
              <span className="takeaway-bullet">✓</span>
              <span><strong>{safeInsights.topCondition}</strong> represents your most common symptom match.</span>
            </div>
          )}
          <div className="takeaway-list-item">
            <span className="takeaway-bullet">✓</span>
            <span>Always monitor your symptoms continuously and follow up with a certified physician.</span>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div 
        style={{ 
          background: '#F8FAFC', 
          border: '1px solid #E2E8F0', 
          borderRadius: '16px', 
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <Info size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
          <strong style={{ color: '#475569' }}>Medical Disclaimer:</strong> This dashboard compiles AI-generated summaries and symptom correlations for educational/informational tracking. It is not an alternative to clinical evaluation. Please seek immediate assistance from emergency services or doctors for active conditions.
        </p>
      </div>
    </div>
  );
};

export default HealthInsightsCard;