// frontend/components/Charts/SymptomFrequencyChart.jsx

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
import { ClipboardList, BarChart3, Star } from 'lucide-react';

/**
 * SymptomFrequencyChart Component
 * Displays top 10 most frequent symptoms as a bar chart
 * 
 * Props:
 *  - data: Array of objects with {symptom, count, percentage}
 */
const SymptomFrequencyChart = ({ data }) => {
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
          <BarChart3 size={32} />
        </div>
        <p style={{ margin: 0, color: '#475569', fontWeight: '700', fontSize: '16px' }}>
          No symptom data available yet
        </p>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Complete a symptom check to see patterns
        </p>
      </div>
    );
  }

  return (
    <div className="symptom-card-premium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .symptom-card-premium {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
        }
        .symptom-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
        }
        .symptom-header-icon {
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
        .symptom-tag-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: linear-gradient(135deg, #EFF9FF 0%, #F5F3FF 100%);
          border-radius: 16px;
          border: 1px solid #E0F2FE;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .symptom-tag-premium::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #0ea5e9 0%, #8b5cf6 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .symptom-tag-premium:hover {
          background: linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 100%);
          transform: translateX(4px);
          border-color: #BAE6FD;
        }
        .symptom-tag-premium:hover::before {
          opacity: 1;
        }
        .symptom-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 8px;
          background: white;
          color: #0284c7;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <div className="symptom-header-icon">
          <ClipboardList size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            Top 10 Most Frequent Symptoms
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Symptoms you've reported most frequently
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 320, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 65 }}
          >
            <defs>
              <linearGradient id="symptomGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="symptom" 
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
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
              itemStyle={{ color: '#0f172a', fontWeight: '700', fontSize: '13px' }}
              labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}
              formatter={(value) => [value, 'Occurrences']}
              cursor={{ fill: 'rgba(14, 165, 233, 0.04)', radius: 8 }}
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
              fill="url(#symptomGrad)" 
              name="Occurrences" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 Summary */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={14} style={{ color: '#eab308', fill: '#eab308' }} /> Most Common Baseline
        </p>
        <div style={{ display: 'grid', gap: '10px' }}>
          {data.slice(0, 3).map((item, idx) => (
            <div key={idx} className="symptom-tag-premium">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="symptom-badge">{idx + 1}</span>
                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>
                  {item.symptom}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '14.5px' }}>
                  {item.count}x
                </span>
                <span style={{ background: 'white', color: '#64748b', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SymptomFrequencyChart;