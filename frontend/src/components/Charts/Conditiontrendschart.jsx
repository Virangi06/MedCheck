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
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-gray-500 font-medium">
          📊 No condition data available yet
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
          Complete analyses to identify condition patterns
        </p>
      </div>
    );
  }

  // Prepare data for horizontal chart
  const chartData = data.map(item => ({
    ...item,
    nameShort: item.condition.length > 25 ? item.condition.substring(0, 22) + '...' : item.condition
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🏥 Most Common Detected Conditions
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Top conditions you've been diagnosed with
        </p>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number"
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            dataKey="condition" 
            type="category" 
            width={200}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            interval={0}
          />
          <Tooltip 
            formatter={(value) => [value, 'Count']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar 
            dataKey="count" 
            fill="#8b5cf6" 
            name="Frequency" 
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Top Conditions Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">Top Conditions:</p>
        {data.slice(0, 5).map((item, idx) => {
          const dateFormatted = new Date(item.lastDetected).toLocaleDateString();
          return (
            <div 
              key={idx}
              className="p-3 rounded-lg border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {idx + 1}. {item.condition}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Last detected: {dateFormatted}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-lg font-bold text-purple-600">
                    {item.count}x
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.percentage}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medical Note */}
      <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
        <p className="text-xs text-yellow-800 font-semibold">💡 NOTE:</p>
        <p className="text-xs text-yellow-900 mt-1">
          These are AI-suggested conditions. Always consult a healthcare professional for accurate diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ConditionTrendsChart;