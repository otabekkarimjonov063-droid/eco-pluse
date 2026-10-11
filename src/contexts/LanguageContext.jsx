import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations/dictionary';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('ecopulse_language') || 'UZ';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('ecopulse_language', lang);
  };

  const t = (section, key) => {
    return translations[language]?.[section]?.[key] 
      || translations['UZ']?.[section]?.[key] 
      || translations['EN']?.[section]?.[key] 
      || key;
  };

  const tText = (obj) => {
    if (!obj) return '';
    if (typeof obj !== 'object') return obj;
    return obj[language] || obj['UZ'] || obj['EN'] || Object.values(obj)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
