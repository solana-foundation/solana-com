import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";
import { routing } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";
import { loadMessages } from "@workspace/i18n/load-messages";

// Load English messages from both sources for fallback
const [enWebMessages, enDocsMessages] = await Promise.all([
  import("../../../../apps/web/public/locales/en/common.json"),
  import("@@/public/locales/en/common.json"),
]);
const enMessages = { ...enWebMessages.default, ...enDocsMessages.default };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested)
    ? requested
    : routing.defaultLocale;

  // Load messages from both sources in parallel with automatic fallback to English
  const [webMessages, docsMessages] = await Promise.all([
    loadMessages(
      (loc) => import(`../../../../apps/web/public/locales/${loc}/common.json`),
      locale,
    ),
    loadMessages(
      (loc) => import(`@@/public/locales/${loc}/common.json`),
      locale,
    ),
  ]);

  // Merge translations, with docs-specific taking precedence.
  const messages = { ...webMessages, ...docsMessages };

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
