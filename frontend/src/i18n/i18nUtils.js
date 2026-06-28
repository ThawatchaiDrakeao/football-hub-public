export const defaultLanguage = "th";
export const fallbackLanguage = "en";
export const languageStorageKey = "footballHubLanguage";
export const legacyLanguageStorageKey = "language";
export const supportedLanguages = ["th", "en"];

export const getNestedValue = (source, key) => {
  if (!source || !key) {
    return undefined;
  }

  return key.split(".").reduce((currentValue, keyPart) => {
    return currentValue?.[keyPart];
  }, source);
};

export const translate = (dictionary, language, key) => {
  return (
    getNestedValue(dictionary[language], key) ||
    getNestedValue(dictionary[fallbackLanguage], key) ||
    key
  );
};

export const getNextLanguage = (language) => {
  return language === "th" ? "en" : "th";
};

export const getSavedLanguage = (storage = globalThis.localStorage) => {
  try {
    const savedLanguage =
      storage?.getItem(languageStorageKey) ||
      storage?.getItem(legacyLanguageStorageKey);

    return supportedLanguages.includes(savedLanguage)
      ? savedLanguage
      : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
};

export const saveLanguage = (
  nextLanguage,
  storage = globalThis.localStorage
) => {
  if (!supportedLanguages.includes(nextLanguage)) {
    return;
  }

  try {
    storage?.setItem(languageStorageKey, nextLanguage);
  } catch {
    // Keep the UI usable even if browser storage is unavailable.
  }
};
