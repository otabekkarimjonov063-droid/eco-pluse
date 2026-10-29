import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/dictionary';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../data/languages';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('ecopulse_language') || 'UZ';
  });
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const currentLanguage = getLanguageByCode(language);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('ecopulse_language', lang);
  };

  const openLangModal = () => setIsLangModalOpen(true);
  const closeLangModal = () => setIsLangModalOpen(false);
  const toggleLangModal = () => setIsLangModalOpen((prev) => !prev);

  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language.toLowerCase();
        document.documentElement.dir = currentLanguage?.rtl ? 'rtl' : 'ltr';
      }
    } catch (e) {
      console.error(e);
    }
  }, [language, currentLanguage]);

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
    <LanguageContext.Provider value={{
      language,
      currentLanguage,
      setLanguage,
      t,
      tText,
      isLangModalOpen,
      setIsLangModalOpen,
      openLangModal,
      closeLangModal,
      toggleLangModal,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

