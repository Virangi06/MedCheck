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
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-gray-500 font-medium">
          📊 No monthly data available yet
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📈 Monthly Health Analysis Trends
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Track your analysis frequency and urgency levels over time
        </p>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="monthLabel"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            angle={data.length > 6 ? -45 : 0}
            textAnchor={data.length > 6 ? "end" : "middle"}
            height={data.length > 6 ? 80 : 40}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Analysis Count', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            domain={[0, 4]}
            label={{ value: 'Avg Urgency (1-4)', angle: 90, position: 'insideRight' }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'analysisCount') return [value, 'Analyses'];
              if (name === 'averageUrgency') return [value.toFixed(2), 'Avg Urgency'];
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            verticalAlign="bottom"
            height={36}
          />
          <Bar 
            yAxisId="left"
            dataKey="analysisCount" 
            fill="#0284c7" 
            name="Total Analyses"
            radius={[8, 8, 0, 0]}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="averageUrgency" 
            stroke="#ef4444" 
            name="Avg Urgency Level"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Recent Months Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Recent Trends (Last 3 Months):</p>
        <div className="space-y-2">
          {chartData.slice(-3).reverse().map((item, idx) => (
            <div 
              key={idx}
              className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.monthLabel}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Urgency Level: {item.averageUrgency <= 1.5 ? '🟢 Low' : item.averageUrgency <= 2.5 ? '🟡 Moderate' : '🔴 High'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {item.analysisCount}
                </p>
                <p className="text-xs text-gray-500">
                  {item.highUrgencyCount} high-risk
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-xs text-gray-600">Total Analyses</p>
          <p className="text-lg font-bold text-blue-600 mt-1">{totalAnalyses}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-xs text-gray-600">Avg/Month</p>
          <p className="text-lg font-bold text-blue-600 mt-1">{avgAnalysesPerMonth}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
          <p className="text-xs text-gray-600">High-Risk</p>
          <p className="text-lg font-bold text-red-600 mt-1">{highRiskTotal}</p>
        </div>
      </div>

      {/* Trend Indicator */}
      {chartData.length >= 2 && (
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-xs text-green-800 font-semibold mb-1">📊 TREND ANALYSIS:</p>
          {(() => {
            const recent = chartData[chartData.length - 1].analysisCount;
            const previous = chartData[chartData.length - 2].analysisCount;
            const trend = recent > previous ? 'Increasing' : recent < previous ? 'Decreasing' : 'Stable';
            const emoji = recent > previous ? '📈' : recent < previous ? '📉' : '➡️';
            return (
              <p className="text-sm text-green-900">
                Analyses are {emoji} <span className="font-semibold">{trend}</span> compared to previous month
              </p>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MonthlyTrendsChart;