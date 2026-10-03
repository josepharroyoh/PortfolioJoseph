import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const ALL_LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
] as const;

// Spanish only while the new design is being reviewed; en / pt return once it is approved.
const SPANISH_ONLY = true;
export const LANGUAGES = SPANISH_ONLY ? ALL_LANGUAGES.filter((l) => l.code === "es") : ALL_LANGUAGES;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    ...(SPANISH_ONLY && { lng: "es" }),
    fallbackLng: "es",
    supportedLngs: ["es", "en", "pt"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

// Keep <html lang> and the meta description in sync; pages set their own title.
const syncDocument = (lng: string) => {
  document.documentElement.lang = lng;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", i18n.t("meta.description"));
};
syncDocument(i18n.resolvedLanguage ?? "es");
i18n.on("languageChanged", syncDocument);

export default i18n;
