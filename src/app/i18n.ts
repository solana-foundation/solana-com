import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import common from "../../public/locales/en/common.json";

const i18nConfig = {
  locales: ["en"],
  defaultLocale: "en",
};

export default async function initTranslations(
  locale,
  namespaces,
  i18nInstance?,
  rs?,
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  const resources = rs || { en: { common } };

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
