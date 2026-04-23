import apiClient from './apiClient';

export const fieldService = {
  // Get all fields (admin only)
  getFields: async () => {
    const response = await apiClient.get('/fields');
    return response.data;
  },

  // Get user's assigned fields
  getMyFields: async () => {
    const response = await apiClient.get('/fields/me');
    return response.data;
  },

  // Get specific field
  getFieldById: async (id) => {
    const response = await apiClient.get(`/fields/${id}`);
    return response.data;
  },

  // Get field updates
  getFieldUpdates: async (fieldId) => {
    const response = await apiClient.get(`/fields/${fieldId}/updates`);
    return response.data;
  },

  // Create field (admin only)
  createField: async (fieldData) => {
    const response = await apiClient.post('/fields', fieldData);
    return response.data;
  },

  // Update field (admin only)
  updateField: async (id, fieldData) => {
    const response = await apiClient.put(`/fields/${id}`, fieldData);
    return response.data;
  },

  // Delete field (admin only)
  deleteField: async (id) => {
    const response = await apiClient.delete(`/fields/${id}`);
    return response.data;
  },

  // Create field update
  createFieldUpdate: async (fieldId, updateData) => {
    const response = await apiClient.post(`/fields/${fieldId}/updates`, updateData);
    return response.data;
  },

  // Update field update
  updateFieldUpdate: async (updateId, updateData) => {
    const response = await apiClient.put(`/fields/updates/${updateId}`, updateData);
    return response.data;
  },

  // Update field update (only author can update)
  updateFieldUpdate: async (fieldId, updateId, updateData) => {
    const response = await apiClient.put(`/fields/${fieldId}/updates/${updateId}`, updateData);
    return response.data;
  },

  // Delete field update (only author can delete)
  deleteFieldUpdate: async (fieldId, updateId) => {
    const response = await apiClient.delete(`/fields/${fieldId}/updates/${updateId}`);
    return response.data;
  },
};
