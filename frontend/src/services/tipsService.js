// frontend/services/tipsService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get personalized daily health tips feed
 */
export const getHealthTips = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/api/tips`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000 // 25s timeout since AI generation can take some time
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching tips:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to load health tips feed'
    );
  }
};

/**
 * Toggle completion of a daily recommendation checklist item
 * @param {string} recId - ID of the recommendation
 * @param {boolean} completed - Target completion state
 */
export const toggleRecommendationCompletion = async (recId, completed) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(
      `${API_URL}/api/tips/recommendations/${recId}/toggle`,
      { completed },
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
    console.error('Error toggling recommendation completion:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to update goal completion status'
    );
  }
};

export default {
  getHealthTips,
  toggleRecommendationCompletion
};
