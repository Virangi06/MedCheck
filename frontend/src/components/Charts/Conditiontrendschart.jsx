// frontend/components/Charts/Conditiontrendschart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ShieldAlert } from 'lucide-react';

const ConditionTrendsChart = ({ data }) => {
  // data here is urgencyStats: { low: X, moderate: Y, high: Z, emergency: W }
  const stats = data || { low: 0, moderate: 0, high: 0, emergency: 0 };

  const chartData = [
    { name: 'Low', count: stats.low || 0 },
    { name: 'Moderate', count: stats.moderate || 0 },
    { name: 'High', count: stats.high || 0 },
    { name: 'Emergency', count: stats.emergency || 0 }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      border: '1.5px solid #e2e8f0',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: '#eff9ff', color: '#0ea5e9',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
            Urgency Levels
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
            Distribution of screening urgency levels
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 220, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={false}
              axisLine={false}
              hide={true}
            />
            <Tooltip 
              formatter={(value) => [`${value} screenings`, 'Count']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                padding: '10px 14px',
                fontFamily: "'DM Sans', sans-serif"
              }}
              itemStyle={{ color: '#0f172a', fontWeight: '700', fontSize: '12px' }}
              labelStyle={{ color: '#64748b', fontSize: '11px', fontWeight: '500', marginBottom: '2px' }}
              cursor={{ fill: '#f8fafc', radius: 6 }}
            />
            <Bar 
              dataKey="count" 
              fill="#0ea5e9" 
              name="Count" 
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConditionTrendsChart;