// frontend/components/Charts/MonthlyTrendsChart.jsx

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, Sparkles } from 'lucide-react';

/**
 * MonthlyTrendsChart Component
 * Displays monthly analysis trends with bar and line combo chart
 * Shows: analysis count and average urgency level per month
 * 
 * Props:
 *  - data: Array of objects with {month, analysisCount, averageUrgency, highUrgencyCount}
 */
const MonthlyTrendsChart = ({ data }) => {
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
          <TrendingUp size={32} />
        </div>
        <p style={{ margin: 0, color: '#475569', fontWeight: '700', fontSize: '16px' }}>
          No monthly data available yet
        </p>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Complete analyses over time to see trends
        </p>
      </div>
    );
  }

  // Format month display (2024-01 → Jan 2024)
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Prepare formatted data
  const chartData = data.map(item => ({
    ...item,
    monthLabel: formatMonth(item.month)
  }));

  // Calculate statistics
  const totalAnalyses = data.reduce((sum, item) => sum + item.analysisCount, 0);
  const avgAnalysesPerMonth = (totalAnalyses / data.length).toFixed(1);
  const highRiskTotal = data.reduce((sum, item) => sum + item.highUrgencyCount, 0);

  // Helper for text-based risk status
  const getUrgencyStatusText = (avg) => {
    if (avg <= 1.5) return { text: 'Low Risk', color: '#059669', bg: '#ecfdf5', dot: '#10b981' };
    if (avg <= 2.5) return { text: 'Moderate Risk', color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' };
    return { text: 'High Risk', color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' };
  };

  return (
    <div className="trends-card-premium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .trends-card-premium {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
        }
        .trends-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
        }
        .trends-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EFF9FF;
          color: #0ea5e9;
          flex-shrink: 0;
        }
        .trend-record-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #F8FAFC;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          transition: all 0.2s ease;
        }
        .trend-record-item:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
          transform: translateY(-1px);
        }
        .trend-metric-card {
          padding: 14px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: all 0.2s ease;
        }
        .trend-metric-card:hover {
          background: white;
          border-color: #cbd5e1;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.03);
        }
        .trend-analysis-box {
          margin-top: 16px;
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ECFDF5;
          border: 1.5px solid #A7F3D0;
        }
        .status-dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div className="trends-header-icon">
          <TrendingUp size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Monthly Health Analysis Trends
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Track your analysis frequency and urgency levels over time
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 350, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData}
            margin={{ top: 10, right: -5, left: -25, bottom: 20 }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="monthLabel"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              angle={data.length > 6 ? -30 : 0}
              textAnchor={data.length > 6 ? "end" : "middle"}
              height={data.length > 6 ? 60 : 40}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              domain={[0, 4]}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                padding: '12px 16px',
                fontFamily: "'DM Sans', sans-serif"
              }}
              formatter={(value, name) => {
                if (name === 'analysisCount') return [value, 'Analyses'];
                if (name === 'averageUrgency') return [value.toFixed(2), 'Avg Urgency'];
                return [value, name];
              }}
            />
            <Legend 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#64748b', paddingTop: '10px' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="analysisCount" 
              fill="url(#barGrad)" 
              name="Total Analyses"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="averageUrgency" 
              stroke="#ef4444" 
              name="Avg Urgency Level"
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Months Summary */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} style={{ color: '#0ea5e9' }} /> Recent Trends (Last 3 Months)
        </p>
        <div style={{ display: 'grid', gap: '10px' }}>
          {chartData.slice(-3).reverse().map((item, idx) => {
            const status = getUrgencyStatusText(item.averageUrgency);
            return (
              <div key={idx} className="trend-record-item">
                <div>
                  <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>
                    {item.monthLabel}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', display: 'inline-flex', alignItems: 'center', color: status.color, background: status.bg, padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                    <span className="status-dot-pulse" style={{ backgroundColor: status.dot }} />
                    {status.text}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '16px', display: 'block', lineHeight: 1 }}>
                      {item.analysisCount}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600' }}>
                      analyses
                    </span>
                  </div>
                  <span style={{ background: item.highUrgencyCount > 0 ? '#FEF2F2' : '#f8fafc', color: item.highUrgencyCount > 0 ? '#ef4444' : '#64748b', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', border: '1px solid', borderColor: item.highUrgencyCount > 0 ? '#FCA5A5' : '#e2e8f0' }}>
                    {item.highUrgencyCount} high-risk
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
        <div className="trend-metric-card">
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Analyses</p>
          <p style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: '800', color: '#0ea5e9' }}>{totalAnalyses}</p>
        </div>
        <div className="trend-metric-card">
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg / Month</p>
          <p style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: '800', color: '#0ea5e9' }}>{avgAnalysesPerMonth}</p>
        </div>
        <div className="trend-metric-card">
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Urgency</p>
          <p style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>{highRiskTotal}</p>
        </div>
      </div>

      {/* Trend Indicator */}
      {chartData.length >= 2 && (
        <div className="trend-analysis-box">
          <Sparkles size={18} style={{ color: '#059669', flexShrink: 0 }} />
          {(() => {
            const recent = chartData[chartData.length - 1].analysisCount;
            const previous = chartData[chartData.length - 2].analysisCount;
            const trend = recent > previous ? 'increased' : recent < previous ? 'decreased' : 'remained stable';
            return (
              <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: 1.5 }}>
                Your assessments have <strong style={{ fontWeight: '800' }}>{trend}</strong> this month compared to the previous month.
              </p>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MonthlyTrendsChart;