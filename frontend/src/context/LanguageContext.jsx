import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";
import {
  getNextLanguage,
  getSavedLanguage,
  saveLanguage,
  supportedLanguages,
  translate,
} from "../i18n/i18nUtils.js";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getSavedLanguage);

  const setLanguage = (nextLanguage) => {
    if (!supportedLanguages.includes(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);
    saveLanguage(nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguage(getNextLanguage(language));
  };

  const t = (key) => translate(translations, language, key);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      supportedLanguages,
      toggleLanguage,
      t,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
