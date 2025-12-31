import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";
import { routing } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";
import { loadMessages } from "@workspace/i18n/load-messages";

const enMessages = (await import("@@/public/locales/en/common.json")).default;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested)
    ? requested
    : routing.defaultLocale;

  // Load the requested locale with automatic fallback to English if it doesn't exist
  const messages = await loadMessages(
    (loc) => import(`@@/public/locales/${loc}/common.json`),
    locale,
  );

  return {
    locale,
    messages,
    getMessageFallback({ namespace, key, error }) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) return "";
      const path = [namespace, key].filter(Boolean).join(".");

      // Helper to get nested value by path
      function getByPath(obj: any, path: string) {
        return path
          .split(".")
          .reduce(
            (acc, part) => (acc && acc[part] ? acc[part] : undefined),
            obj,
          );
      }

      // Try to get the fallback from English messages
      const fallback = getByPath(enMessages, path);

      // Return the fallback if found, otherwise the path
      return fallback ?? path;
    },
  };
});
