import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "./tr/translation.json";
import en from "./en/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: "tr", // Başlangıç dili
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;