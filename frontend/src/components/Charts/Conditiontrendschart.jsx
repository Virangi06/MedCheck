// frontend/components/Charts/ConditionTrendsChart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Hospital, Activity, Calendar, Award } from 'lucide-react';

/**
 * ConditionTrendsChart Component
 * Displays most common detected conditions as a horizontal bar chart
 * 
 * Props:
 *  - data: Array of objects with {condition, count, percentage, lastDetected}
 */
const ConditionTrendsChart = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
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
          <Hospital size={32} />
        </div>
        <p style={{ margin: 0, color: '#475569', fontWeight: '700', fontSize: '16px' }}>
          No condition data available yet
        </p>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Complete analyses to identify condition patterns
        </p>
      </div>
    );
  }

  // Prepare data for horizontal chart
  const chartData = data.map(item => ({
    ...item,
    nameShort: item.condition.length > 20 ? item.condition.substring(0, 17) + '...' : item.condition
  }));

  return (
    <div className="condition-card-premium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .condition-card-premium {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
        }
        .condition-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
        }
        .condition-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F3FF;
          color: #8b5cf6;
          flex-shrink: 0;
        }
        .medical-record-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #FAF8FF;
          border-radius: 16px;
          border: 1px solid #F3E8FF;
          transition: all 0.2s ease;
        }
        .medical-record-item:hover {
          background: #F3E8FF;
          border-color: #E9D5FF;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.05);
        }
        .med-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 8px;
          background: white;
          color: #8b5cf6;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
        }
        .note-box {
          margin-top: 20px;
          padding: 16px 20px;
          border-radius: 16px;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div className="condition-header-icon">
          <Hospital size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Most Common Detected Conditions
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Top conditions you've been diagnosed with
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 110, bottom: 10 }}
          >
            <defs>
              <linearGradient id="conditionGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis 
              type="number"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              dataKey="nameShort" 
              type="category" 
              width={100}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              formatter={(value) => [value, 'Frequency']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                padding: '12px 16px',
                fontFamily: "'DM Sans', sans-serif"
              }}
              itemStyle={{ color: '#0f172a', fontWeight: '700', fontSize: '13px' }}
              labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.03)', radius: 6 }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#64748b', paddingBottom: '10px' }}
            />
            <Bar 
              dataKey="count" 
              fill="url(#conditionGrad)" 
              name="Frequency" 
              radius={[0, 6, 6, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Conditions Summary */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} style={{ color: '#8b5cf6' }} /> Top Conditions History
        </p>
        {data.slice(0, 5).map((item, idx) => {
          const dateFormatted = new Date(item.lastDetected).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          return (
            <div key={idx} className="medical-record-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="med-badge">{idx + 1}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>
                    {item.condition}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Last detected: {dateFormatted}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#8b5cf6', fontWeight: '800', fontSize: '15px' }}>
                  {item.count}x
                </span>
                <span style={{ background: 'white', color: '#64748b', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medical Note */}
      <div className="note-box">
        <Activity size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#b45309' }}>AI Diagnosis Information Note</p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b45309', lineHeight: 1.5, opacity: 0.9 }}>
            These represent matches suggested by the AI assessment model based on symptoms you checked. Please consult a registered healthcare provider for clinical evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionTrendsChart;