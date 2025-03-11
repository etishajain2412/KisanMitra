import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import BN from "./locales/bn.json";
import GU from "./locales/gu.json";
import PA from "./locales/pa.json";

i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Connects i18n with React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: BN },
      gu: { translation: GU },
      pa: { translation: PA }
    },
    fallbackLng: "en", // Default language
    detection: { order: ["navigator", "localStorage", "sessionStorage"] },
    interpolation: { escapeValue: false },
    detection: {
      order: ["navigator", "localStorage", "cookie"],
      caches: ["localStorage", "cookie"]
    }
  });

export default i18n;
