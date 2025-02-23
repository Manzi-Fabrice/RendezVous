import API_URL from '../config';

// Generic API call function
const callApi = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API functions
const api = {
  // User endpoints
  getUsers: () => callApi('/api/users'),
  createUser: (userData) => callApi('/api/users', 'POST', userData),

  // Event endpoints
  getEvents: () => callApi('/api/events'),
  createEvent: (eventData) => callApi('/api/events', 'POST', eventData),
  saveEvent: (userId, eventId) => callApi('/api/users/save-event', 'POST', { userId, eventId }),

  // Restaurant recommendations
  getRecommendations: (preferences) => callApi('/api/recommendations/personalized', 'POST', preferences),
};

export default api;
