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
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-center text-gray-500 font-medium">
          📊 No symptom data available yet
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
          Complete a symptom check to see patterns
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📋 Top 10 Most Frequent Symptoms
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Symptoms you've reported most frequently
        </p>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="symptom" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => [value, 'Count']}
            cursor={{ fill: 'rgba(2, 132, 199, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar 
            dataKey="count" 
            fill="#0284c7" 
            name="Occurrences" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Top 3 Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Most Common:</p>
        <div className="grid grid-cols-1 gap-2">
          {data.slice(0, 3).map((item, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <span className="font-medium text-gray-700">
                {idx + 1}. {item.symptom}
              </span>
              <div className="text-right">
                <span className="text-blue-600 font-bold block text-sm">
                  {item.count}x
                </span>
                <span className="text-gray-500 text-xs">
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