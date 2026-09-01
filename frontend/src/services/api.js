import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to append JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('college_transport_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, redirect to login
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register-admin')) {
        localStorage.removeItem('college_transport_token');
        localStorage.removeItem('college_transport_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
