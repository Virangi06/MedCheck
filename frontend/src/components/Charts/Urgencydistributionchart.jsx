// frontend/components/Charts/UrgencyDistributionChart.jsx

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ShieldAlert, Activity } from 'lucide-react';

/**
 * UrgencyDistributionChart Component
 * Displays analysis urgency levels as a pie chart
 * 
 * Props:
 *  - data: Object with {low, moderate, high, emergency} counts
 */
const UrgencyDistributionChart = ({ data }) => {
  // Color scheme for urgency levels matching the theme
  const COLORS = {
    low: '#059669',      // Green
    moderate: '#D97706', // Amber
    high: '#DC2626',     // Red
    emergency: '#7C3AED' // Purple
  };

  // Transform data for pie chart
  const chartData = [
    { name: 'Low Risk', value: data.low || 0, color: COLORS.low },
    { name: 'Moderate Risk', value: data.moderate || 0, color: COLORS.moderate },
    { name: 'High Risk', value: data.high || 0, color: COLORS.high },
    { name: 'Emergency', value: data.emergency || 0, color: COLORS.emergency }
  ].filter(item => item.value > 0);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // Handle empty data
  if (total === 0) {
    return (
      <div 
        style={{
          padding: '40px 24px',
          background: '#f8fafc',
          borderRadius: '24px',
          border: '2px dashed #cbd5e1',
          textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '16px', background: '#f1f5f9', color: '#64748b', marginBottom: '16px' }}>
          <ShieldAlert size={32} />
        </div>
        <p style={{ margin: 0, color: '#475569', fontWeight: '700', fontSize: '16px' }}>
          No urgency data available yet
        </p>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Complete analyses to track urgency levels
        </p>
      </div>
    );
  }

  const highEmergencyPercentage = (((data.high || 0) + (data.emergency || 0)) / total * 100).toFixed(1);

  return (
    <div className="urgency-card-premium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .urgency-card-premium {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
        }
        .urgency-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
        }
        .urgency-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FEF2F2;
          color: #ef4444;
          flex-shrink: 0;
        }
        .stat-grid-cell {
          padding: 16px;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          background: #f8fafc;
        }
        .stat-grid-cell:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }
        .risk-summary-box {
          margin-top: 20px;
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #EFF9FF;
          border: 1.5px solid #BAE6FD;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div className="urgency-header-icon">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Analysis Urgency Distribution
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Breakdown of analysis urgency levels
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 260, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={6} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Assessments']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                padding: '10px 14px',
                fontFamily: "'DM Sans', sans-serif"
              }}
              itemStyle={{ color: '#0f172a', fontWeight: '700', fontSize: '13px' }}
            />
            <Legend 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#64748b', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '20px' }}>
        {chartData.map((item, idx) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div 
              key={idx} 
              className="stat-grid-cell"
              style={{ 
                backgroundColor: item.color + '09',
                borderColor: item.color + '30'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>
                  {item.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: item.color, lineHeight: 1 }}>
                  {item.value}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                  ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Assessment */}
      <div className="risk-summary-box">
        <Activity size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: '13px', color: '#0369a1', lineHeight: 1.5 }}>
          <strong style={{ fontWeight: '800' }}>{highEmergencyPercentage}%</strong> of your analyses were high urgency or emergency cases.
        </p>
      </div>
    </div>
  );
};

export default UrgencyDistributionChart;