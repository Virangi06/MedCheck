// frontend/components/Charts/Symptomfrequencychart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Calendar } from 'lucide-react';

const SymptomFrequencyChart = ({ data }) => {
  // data here is monthlyData: [ { month: '2026-06', analysisCount: 6, ... } ]
  const monthlyList = data || [];

  const chartData = monthlyList.map(item => {
    const [year, monthStr] = item.month.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(monthStr, 10) - 1] || monthStr;
    return {
      monthLabel: `${monthName} ${year.substring(2)}`,
      count: item.analysisCount || 0
    };
  });

  // Calculate statistics for details
  const totalChecks = chartData.reduce((sum, item) => sum + item.count, 0);
  const activeMonths = chartData.length;
  
  let peakMonth = 'N/A';
  let maxCount = 0;
  chartData.forEach(item => {
    if (item.count > maxCount) {
      maxCount = item.count;
      peakMonth = item.monthLabel;
    }
  });

  // Dynamic analysis text
  let analysisText = '';
  if (totalChecks === 0) {
    analysisText = 'No screening history is available to analyze at this time. Run some symptom checks to generate analytical data.';
  } else {
    analysisText = `Your screening activity peaked in ${peakMonth} with ${maxCount} checks. Over the tracked period of ${activeMonths} month${activeMonths > 1 ? 's' : ''}, you maintained an average of ${(totalChecks / Math.max(activeMonths, 1)).toFixed(1)} symptom checks per month.`;
    if (chartData.length >= 2) {
      const lastVal = chartData[chartData.length - 1].count;
      const prevVal = chartData[chartData.length - 2].count;
      if (lastVal > prevVal) {
        analysisText += ` Your check frequency increased from ${prevVal} in ${chartData[chartData.length - 2].monthLabel} to ${lastVal} in ${chartData[chartData.length - 1].monthLabel}, indicating more active health monitoring recently.`;
      } else if (lastVal < prevVal) {
        analysisText += ` Your check frequency decreased from ${prevVal} in ${chartData[chartData.length - 2].monthLabel} to ${lastVal} in ${chartData[chartData.length - 1].monthLabel}, indicating a reduction in new symptom tracking.`;
      } else {
        analysisText += ` Your tracking volume has remained stable at ${lastVal} check${lastVal !== 1 ? 's' : ''} in each of the last two months.`;
      }
    }
  }

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
          background: '#eff9ff', color: '#1e3a8a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Calendar size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
            Screening Activity
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
            Number of symptom checks per month
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 260, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
          >
            <XAxis 
              dataKey="monthLabel" 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: '600' }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={(value) => [`${value} checks`, 'Activity']}
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
              fill="#1e3a8a" 
              name="Activity" 
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            >
              <LabelList 
                dataKey="count" 
                position="top" 
                fill="#1e3a8a" 
                fontSize={11} 
                fontWeight="700"
                formatter={(v) => v > 0 ? v : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Details Section */}
      <div style={{
        marginTop: '28px',
        borderTop: '1.5px solid #f1f5f9',
        paddingTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
              Chart Foundation
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
              Tracks your historical diagnostic screening frequency across calendar months. This timeline illustrates check-in volume to reveal active tracking periods or seasonal trends.
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
              Chart Analysis
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
              {analysisText}
            </p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: '#eff9ff',
          border: '1px solid #e0f2fe',
          borderRadius: '16px',
          padding: '16px 20px',
          marginTop: '8px'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Total Assessments</span>
            <span style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800', marginTop: '2px', display: 'block' }}>{totalChecks} screenings</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Monthly Average</span>
            <span style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800', marginTop: '2px', display: 'block' }}>{(totalChecks / Math.max(activeMonths, 1)).toFixed(1)} checks / mo</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Peak Period</span>
            <span style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800', marginTop: '2px', display: 'block' }}>{peakMonth} ({maxCount} checks)</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Active Tracking</span>
            <span style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800', marginTop: '2px', display: 'block' }}>{activeMonths} month{activeMonths !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomFrequencyChart;