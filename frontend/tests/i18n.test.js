import assert from "node:assert/strict";
import test from "node:test";
import { translations } from "../src/i18n/translations.js";
import {
  getNextLanguage,
  getSavedLanguage,
  languageStorageKey,
  saveLanguage,
  translate,
} from "../src/i18n/i18nUtils.js";

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
};

test("translate returns Thai text for Thai language", () => {
  assert.equal(translate(translations, "th", "nav.home"), "หน้าแรก");
});

test("translate returns English text for English language", () => {
  assert.equal(translate(translations, "en", "nav.home"), "Home");
});

test("translate falls back to English when the selected language is missing a key", () => {
  const dictionary = {
    th: {},
    en: {
      demo: {
        label: "English fallback",
      },
    },
  };

  assert.equal(
    translate(dictionary, "th", "demo.label"),
    "English fallback"
  );
});

test("translate falls back to the key when no language has a value", () => {
  assert.equal(translate(translations, "th", "missing.key"), "missing.key");
});

test("language storage persists selected language", () => {
  const storage = createMemoryStorage();

  saveLanguage("en", storage);

  assert.equal(storage.getItem(languageStorageKey), "en");
  assert.equal(getSavedLanguage(storage), "en");
});

test("language toggle switches between Thai and English", () => {
  assert.equal(getNextLanguage("th"), "en");
  assert.equal(getNextLanguage("en"), "th");
});

test("translated password validation message is available", () => {
  assert.equal(
    translate(translations, "th", "auth.passwordMinLength"),
    "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
  );
});
