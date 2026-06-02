// frontend/services/medicineService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Check interactions for a list of medicines
 * @param {Array<string>} medicines - List of medicine names
 * @param {boolean} checkAgainstProfile - Whether to also check against patient profile meds
 */
export const checkMedicineInteractions = async (medicines, checkAgainstProfile = true) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/api/medicine/check`,
      { medicines, checkAgainstProfile },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error checking interactions:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to check medicine interactions'
    );
  }
};

/**
 * Get current profile medications
 */
export const getMyMedications = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/api/medicine/my-medications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    return response.data;
  } catch (error) {
    console.error('Error getting medications:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to retrieve profile medications'
    );
  }
};

export default {
  checkMedicineInteractions,
  getMyMedications
};
