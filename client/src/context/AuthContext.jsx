// ── Auth Context ──
// Provides user state, login, signup, logout, and profile update across the app

import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('vt_token');
    const savedUser = localStorage.getItem('vt_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('vt_token');
        localStorage.removeItem('vt_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('vt_token', data.token);
    localStorage.setItem('vt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await API.post('/auth/signup', { name, email, password });
    localStorage.setItem('vt_token', data.token);
    localStorage.setItem('vt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vt_token');
    localStorage.removeItem('vt_user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await API.put('/auth/profile', updates);
    localStorage.setItem('vt_token', data.token);
    localStorage.setItem('vt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
