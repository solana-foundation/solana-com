import { createInstance, i18n, Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { locales, defaultLocale, namespaces } from "./config.cjs";

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource,
) {
  i18nInstance = i18nInstance || createInstance();
  i18nInstance.use(initReactI18next);
  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (lang: string, ns: string) =>
          import(`../../public/locales/${lang}/${ns}.json`),
      ),
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}

export async function serverTranslation(
  lng: string,
  ns: string[] = namespaces,
) {
  const { i18n } = await initTranslations(lng, ns);
  return {
    t: i18n.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
  };
}
