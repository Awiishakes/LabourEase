import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, ur } from '../locales';

const resources = {
  en: { translation: en },
  ur: { translation: ur },
}

i18n
  .use(LanguageDetector) // Automatically detect language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false, // React already escapes strings
    },
  });

export default i18n;



