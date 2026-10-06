import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations/dictionary';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('UZ'); // UZ, RU, EN

  const t = (section, key) => {
    return translations[language][section][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
