import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import taTranslation from './locales/ta.json';
import hiTranslation from './locales/hi.json';

const savedLanguage = localStorage.getItem('college_transport_lang') || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ta: { translation: taTranslation },
      hi: { translation: hiTranslation }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Listen to language change to save
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('college_transport_lang', lng);
});

export default i18n;
