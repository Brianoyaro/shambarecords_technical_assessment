import apiClient from './apiClient';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data;
  },
};
