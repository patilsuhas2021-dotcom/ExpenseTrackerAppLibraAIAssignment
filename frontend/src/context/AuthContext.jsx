import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure global axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // We can get user profile from login payload or define a simple verify endpoint.
        // For simplicity, we store the user details in localStorage as well, but verify token.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no stored user, clear token
          setToken(null);
        }
      } catch (err) {
        console.error('Error loading user', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  // Register User
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { token: userToken, user: userData } = res.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: userToken, user: userData } = res.data;

      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Login failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update Theme in User profile
  const syncThemePreference = async (theme) => {
    if (!token) return;
    try {
      await axios.put(`${API_URL}/auth/theme`, { theme });
      const updatedUser = { ...user, themePreference: theme };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to sync theme preference with backend', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        syncThemePreference
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
