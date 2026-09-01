import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const saved = localStorage.getItem('college_transport_lang') || 'en';
    if (saved !== i18n.language) {
      i18n.changeLanguage(saved);
      setCurrentLang(saved);
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('college_transport_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
