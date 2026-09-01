import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        setUser(res.data);
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (registerData) => {
    setLoading(true);
    try {
      const res = await authService.registerAdmin(registerData);
      if (res.success && res.data) {
        setUser(res.data);
        return res;
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, registerAdmin, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
