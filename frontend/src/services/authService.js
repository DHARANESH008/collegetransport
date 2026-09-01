import api from './api';

export const authService = {
  validateReferenceId: async (code) => {
    const response = await api.get(`/auth/validate-reference-id?code=${encodeURIComponent(code)}`);
    return response.data;
  },

  registerAdmin: async (registerData) => {
    const response = await api.post('/auth/register-admin', registerData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('college_transport_token', response.data.data.token);
      localStorage.setItem('college_transport_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('college_transport_token', response.data.data.token);
      localStorage.setItem('college_transport_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('college_transport_token');
    localStorage.removeItem('college_transport_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('college_transport_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
