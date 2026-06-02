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

/**
 * UrgencyDistributionChart Component
 * Displays analysis urgency levels as a pie chart
 * 
 * Props:
 *  - data: Object with {low, moderate, high, emergency} counts
 */
const UrgencyDistributionChart = ({ data }) => {
  // Color scheme for urgency levels
  const COLORS = {
    low: '#10b981',      // Green
    moderate: '#f59e0b', // Amber
    high: '#ef4444',     // Red
    emergency: '#7c3aed' // Purple
  };

  // Transform data for pie chart
  const chartData = [
    { name: 'Low Risk', value: data.low, color: COLORS.low },
    { name: 'Moderate Risk', value: data.moderate, color: COLORS.moderate },
    { name: 'High Risk', value: data.high, color: COLORS.high },
    { name: 'Emergency', value: data.emergency, color: COLORS.emergency }
  ].filter(item => item.value > 0);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  // Handle empty data
  if (total === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-gray-500 font-medium">
          📊 No urgency data available yet
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
          Complete analyses to track urgency levels
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          ⚠️ Analysis Urgency Distribution
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Breakdown of analysis urgency levels
        </p>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Count']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Statistics Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {chartData.map((item, idx) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div 
              key={idx} 
              className="p-3 rounded-lg border transition-all hover:shadow-md"
              style={{ 
                backgroundColor: item.color + '15',
                borderColor: item.color
              }}
            >
              <p className="text-xs text-gray-600 font-medium">
                {item.name}
              </p>
              <p className="text-xl font-bold mt-1" style={{ color: item.color }}>
                {item.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {percentage}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Risk Assessment */}
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-gray-600 font-semibold mb-1">RISK SUMMARY:</p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{((data.high + data.emergency) / total * 100).toFixed(1)}%</span> of your analyses 
          were high urgency or emergency
        </p>
      </div>
    </div>
  );
};

export default UrgencyDistributionChart;