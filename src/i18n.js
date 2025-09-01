import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Archivos de traduccion
import translationEN from "./locales/en.json";
import translationES from "./locales/es.json";
import translationPT from "./locales/pt.json";

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa la instancia de i18n a react-i18next
  .init({
    resources,
    fallbackLng: "es", // Idioma por defecto si el detectado no está disponible
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;