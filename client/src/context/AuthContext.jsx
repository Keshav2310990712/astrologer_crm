import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved token and user on startup
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify/refresh user data from server
          const response = await api.get('/auth/me');
          if (response.data.success) {
            const freshUser = response.data.data;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error('Failed to restore authentication session:', error.message);
          // Token is invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: jwtToken, ...userData } = response.data.data;
        
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(jwtToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.success) {
        const { token: jwtToken, ...newUserData } = response.data.data;
        
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        setToken(jwtToken);
        setUser(newUserData);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
