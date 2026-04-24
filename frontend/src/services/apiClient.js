import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and other errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 if user has a token (meaning they're supposedly authenticated)
    // Don't intercept 401s on login/register attempts (user has no token yet)
    if (error.response?.status === 401) {
      const token = useAuthStore.getState().token;
      if (token) {
        // Token exists but got 401 - token is invalid/expired, logout and redirect
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      // If no token, let the error propagate (likely a login attempt with wrong credentials)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
