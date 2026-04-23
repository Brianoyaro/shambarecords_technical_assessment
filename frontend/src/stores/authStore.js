import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Login action
  login: (token, user) => {
    set({ token, user, isAuthenticated: true });
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Logout action
  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Set user
  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Set token
  setToken: (token) => {
    set({ token });
    localStorage.setItem('authToken', token);
  },

  // Initialize from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  },
}));
