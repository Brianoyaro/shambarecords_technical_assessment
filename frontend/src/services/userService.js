import apiClient from './apiClient';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  // Activate a user (admin only)
  activateUser: async (userId) => {
    const response = await apiClient.put(`/admin/activate/${userId}`);
    return response.data;
  },

  // Deactivate a user (admin only)
  deactivateUser: async (userId) => {
    const response = await apiClient.put(`/admin/deactivate/${userId}`);
    return response.data;
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/delete/${userId}`);
    return response.data;
  },

  // Register a new user (admin only)
  registerUser: async (userData) => {
    const response = await apiClient.post('/admin/register', userData);
    return response.data;
  },
};
