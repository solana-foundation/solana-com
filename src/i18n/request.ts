import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";
import { routing } from "./routing";
import { locales } from "./config";

const enMessages = (await import('@@/public/locales/en/common.json')).default;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested)
    ? requested
    : routing.defaultLocale;
  const messages = (await import(`@@/public/locales/${locale}/common.json`)).default;

  return {
    locale,
    messages,
    getMessageFallback({ namespace, key, error }) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) return "";
      const path = [namespace, key].filter(Boolean).join(".");

      // Helper to get nested value by path
      function getByPath(obj: any, path: string) {
        return path.split('.').reduce((acc, part) => (acc && acc[part] ? acc[part] : undefined), obj);
      }

      // Try to get the fallback from English messages
      const fallback = getByPath(enMessages, path);

      // Return the fallback if found, otherwise the path
      return fallback ?? path;
    },
  };
});
