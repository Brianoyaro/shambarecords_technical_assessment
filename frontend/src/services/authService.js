import apiClient from './apiClient';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    // Backend returns { message, data: { token, user } }
    // Return just the data part with token and user
    return response.data.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    // Backend returns { message, data: { id, username, email, role, status } }
    return response.data.data;
  },
};
