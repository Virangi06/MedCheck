// frontend/services/statisticsService.js
// Copy this file to your frontend/services directory

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get comprehensive dashboard statistics
 * Includes all chart data: symptoms, urgency, conditions, trends, insights
 */
export const getDashboardStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/api/statistics/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch statistics. Please try again.'
    );
  }
};

/**
 * Get quick summary statistics (lightweight)
 * Only returns basic counts without detailed aggregation
 */
export const getStatisticsSummary = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/api/statistics/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching summary:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch summary'
    );
  }
};

/**
 * Clear the cached statistics (forces recalculation on next request)
 * Useful after new analysis or bulk operations
 */
export const clearStatisticsCache = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/api/statistics/clear-cache`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error clearing cache:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to clear cache'
    );
  }
};

/**
 * Utility function to check if data is from cache
 * Useful for showing "Last updated" timestamps
 */
export const isDataFromCache = (response) => {
  return response?.fromCache === true;
};

/**
 * Utility function to format data for debugging
 */
export const logStatistics = (statistics) => {
  console.log('=== Statistics Data ===');
  console.log('Total Analyses:', statistics.totalAnalyses);
  console.log('Top Symptom:', statistics.symptomFrequency[0]?.symptom);
  console.log('Average Urgency:', statistics.insights?.averageUrgencyLevel);
  console.log('Risk Level:', statistics.insights?.riskLevel);
  console.log('Top Condition:', statistics.insights?.topCondition);
};

export const getHealthMetrics = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_URL}/api/statistics/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching health metrics:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch health metrics');
  }
};

export const saveHealthMetric = async (metricData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.post(`${API_URL}/api/statistics/metrics`, metricData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving health metric:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to save health metric');
  }
};

export default {
  getDashboardStatistics,
  getStatisticsSummary,
  clearStatisticsCache,
  isDataFromCache,
  logStatistics,
  getHealthMetrics,
  saveHealthMetric
};