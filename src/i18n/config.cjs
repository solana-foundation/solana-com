// locales.cjs
const locales = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
];

const languages = {
  "en": "English",
  "zh": "汉语",
  "ru": "Русский",
  "es": "Español",
  "fr": "Français",
  "id": "Bahasa Indonesia",
  "pt": "Português",
  "vi": "Tiếng Việt",
  "de": "Deutsch",
  "tr": "Türkçe",
  "ko": "한국어",
  "uk": "Українська",
  "ar": "العربية",
  "it": "Italiano",
  "pl": "Polski",
  "ja": "日本語",
  "nl": "Nederlands",
  "el": "Ελληνικά",
  "fi": "suomi",
  "hi": "हिन्दी"
}

const defaultLocale = "en";
const namespaces = ["common"];
const staticLocales = ["en"];

module.exports = {
  locales,
  languages,
  defaultLocale,
  namespaces,
  staticLocales,
};
