import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('leoaxis_token');
    const storedUser = localStorage.getItem('leoaxis_user');

    if (token && storedUser) {
      try {
        // Verify token is still valid by fetching profile
        const response = await api.get(ENDPOINTS.GET_PROFILE);
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid, clear storage
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, { email, password });
      const { token, ...userData } = response.data.data;

      // Store token and user data
      localStorage.setItem('leoaxis_token', token);
      localStorage.setItem('leoaxis_user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, data: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, userData);
      const { token, ...newUser } = response.data.data;

      // Auto-login after registration
      localStorage.setItem('leoaxis_token', token);
      localStorage.setItem('leoaxis_user', JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, data: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('leoaxis_token');
    localStorage.removeItem('leoaxis_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('leoaxis_user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
