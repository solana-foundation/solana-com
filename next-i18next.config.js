const { locales, defaultLocale } = require("./src/i18n/config.cjs");
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale,
    localeDetection: false,
  },
};
