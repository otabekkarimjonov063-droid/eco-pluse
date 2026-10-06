import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecopulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ecopulse_user', JSON.stringify(userData));
  };

  const logout = async () => {
    if (user) {
      const { sendTelegramMessage } = await import('../utils/telegram.js');
      await sendTelegramMessage(`🚪 <b>Foydalanuvchi chiqdi</b>\n\nIsmi: ${user.name}\nEmail: ${user.email}`);
    }
    setUser(null);
    localStorage.removeItem('ecopulse_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
