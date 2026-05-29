import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/feedback';

export const feedbackAPI = {
  // Create feedback
  create: async (feedbackData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/create`, feedbackData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get all approved feedbacks
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/all`);
    return response.data;
  },

  // Get user's feedbacks
  getUserFeedbacks: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/my-feedbacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Update feedback
  update: async (id, feedbackData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE}/update/${id}`, feedbackData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Delete feedback
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get random feedbacks for homepage
  getRandomFeedbacks: async (limit = 3) => {
    const response = await axios.get(`${API_BASE}/random/${limit}`);
    return response.data;
  },
};