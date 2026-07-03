import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = `${process.env.REACT_APP_API_URL}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('az_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const data = res.data;
    setUser(data);
    localStorage.setItem('az_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password });
    const data = res.data;
    setUser(data);
    localStorage.setItem('az_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('az_user');
  };

  // Attach JWT to every axios request automatically
  axios.defaults.headers.common['Authorization'] =
    user ? `Bearer ${user.token}` : '';

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);