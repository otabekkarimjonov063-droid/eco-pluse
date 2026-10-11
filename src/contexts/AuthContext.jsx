import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ADMIN_EMAIL = 'otabekkarimjonov063@gmail.com';

export const isUserAdmin = (user) => {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const name = (user.name || '').toLowerCase().trim();
  return (
    email === ADMIN_EMAIL ||
    email.includes('kemmchik82') ||
    name.includes('kemmchik82') ||
    name === 'otabek karimjonov'
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecopulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = isUserAdmin(user);

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
    localStorage.removeItem('adminLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isUserAdmin, ADMIN_EMAIL, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
