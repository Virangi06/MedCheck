// frontend/components/Charts/HealthInsightsCard.jsx

import React from 'react';

/**
 * HealthInsightsCard Component
 * Displays key health insights and metrics in card format
 * 
 * Props:
 *  - insights: Object with {totalAnalyses, averageUrgencyLevel, riskLevel, topCondition, recommendedAction, trend}
 */
const HealthInsightsCard = ({ insights }) => {
  // Helper function to get color for risk level
  const getRiskLevelColor = (riskLevel) => {
    if (riskLevel?.includes('Critical')) return 'bg-red-100 text-red-700 border-red-300';
    if (riskLevel?.includes('High')) return 'bg-red-100 text-red-700 border-red-300';
    if (riskLevel?.includes('Moderate')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  // Helper function to get background color for recommendations
  const getRecommendationBgColor = (recommendation) => {
    if (recommendation?.includes('🔴')) return 'bg-red-50 border-red-300 text-red-900';
    if (recommendation?.includes('🟡')) return 'bg-yellow-50 border-yellow-300 text-yellow-900';
    return 'bg-green-50 border-green-300 text-green-900';
  };

  // Helper function to get urgency level color
  const getUrgencyLevelColor = (level) => {
    if (level === 'Emergency') return 'text-purple-600 bg-purple-50 border-purple-200';
    if (level === 'High') return 'text-red-600 bg-red-50 border-red-200';
    if (level === 'Moderate') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // Default values if insights not provided
  const defaultInsights = {
    totalAnalyses: 0,
    averageUrgencyLevel: 'N/A',
    riskLevel: 'No Risk',
    mostRecentAnalysis: null,
    topCondition: 'No data',
    recommendedAction: 'No recommendation',
    trend: 'Stable'
  };

  const safeInsights = { ...defaultInsights, ...insights };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses Card */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                Total Analyses
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {safeInsights.totalAnalyses}
              </p>
              <p className="text-xs text-gray-500 mt-2">Health check-ups completed</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>

        {/* Average Urgency Card */}
        <div className={`bg-white p-5 rounded-lg shadow-md border-2 hover:shadow-lg transition-shadow ${getUrgencyLevelColor(safeInsights.averageUrgencyLevel)}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
                Average Urgency
              </p>
              <p className="text-3xl font-bold mt-2">
                {safeInsights.averageUrgencyLevel}
              </p>
              <p className="text-xs opacity-75 mt-2">Across all analyses</p>
            </div>
            <span className="text-3xl">
              {safeInsights.averageUrgencyLevel === 'Low' ? '🟢' : 
               safeInsights.averageUrgencyLevel === 'Moderate' ? '🟡' : 
               safeInsights.averageUrgencyLevel === 'High' ? '🔴' : '🟣'}
            </span>
          </div>
        </div>

        {/* Risk Level Card */}
        <div className={`bg-white p-5 rounded-lg shadow-md border-2 hover:shadow-lg transition-shadow ${getRiskLevelColor(safeInsights.riskLevel)}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
                Your Risk Level
              </p>
              <p className="text-2xl font-bold mt-2">
                {safeInsights.riskLevel}
              </p>
              <p className="text-xs opacity-75 mt-2">Overall assessment</p>
            </div>
            <span className="text-3xl">
              {safeInsights.riskLevel?.includes('Low') ? '✅' : '⚠️'}
            </span>
          </div>
        </div>

        {/* Top Condition Card */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                Top Condition
              </p>
              <p className="text-lg font-bold text-purple-600 mt-2 truncate">
                {safeInsights.topCondition}
              </p>
              <p className="text-xs text-gray-500 mt-2">Most frequently detected</p>
            </div>
            <span className="text-3xl">🏥</span>
          </div>
        </div>
      </div>

      {/* Large Recommendation Card */}
      <div className={`p-6 rounded-lg shadow-md border-2 hover:shadow-lg transition-shadow ${getRecommendationBgColor(safeInsights.recommendedAction)}`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">
            {safeInsights.recommendedAction?.includes('🔴') ? '🔴' : 
             safeInsights.recommendedAction?.includes('🟡') ? '🟡' : '🟢'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold opacity-75 uppercase tracking-wide">
              Recommendation
            </p>
            <p className="text-lg font-semibold mt-2">
              {safeInsights.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Analysis Card */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-semibold">Last Analysis</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatDate(safeInsights.mostRecentAnalysis)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {safeInsights.mostRecentAnalysis ? '📅 Recent activity' : 'No analyses yet'}
          </p>
        </div>

        {/* Trend Card */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm font-semibold">Health Trend</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {safeInsights.trend}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {safeInsights.trend.includes('📈') ? 'More analyses recently' : 
             safeInsights.trend.includes('📉') ? 'Fewer analyses recently' : 'Consistent pattern'}
          </p>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
        <p className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3">
          💡 Key Takeaways
        </p>
        <ul className="space-y-2 text-sm text-blue-900">
          {safeInsights.totalAnalyses > 0 && (
            <li>✓ You've completed <strong>{safeInsights.totalAnalyses}</strong> health analyses</li>
          )}
          {safeInsights.averageUrgencyLevel !== 'N/A' && (
            <li>✓ Your average urgency level is <strong>{safeInsights.averageUrgencyLevel}</strong></li>
          )}
          {safeInsights.topCondition !== 'No data' && (
            <li>✓ <strong>{safeInsights.topCondition}</strong> is your most common diagnosis</li>
          )}
          {!safeInsights.recommendedAction?.includes('🔴') && (
            <li>✓ Keep maintaining healthy habits and regular check-ups</li>
          )}
        </ul>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">⚠️ Medical Disclaimer:</span> This dashboard provides 
          AI-generated insights based on your reported symptoms. It is not a substitute for professional 
          medical advice. Always consult a licensed healthcare provider for accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default HealthInsightsCard;