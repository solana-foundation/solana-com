import { getRequestConfig } from "next-intl/server";
import { AbstractIntlMessages, IntlErrorCode } from "next-intl";
import { routing } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";

export async function loadMessages(
  importPath: (locale: string) => Promise<{ default: AbstractIntlMessages }>,
  locale: string
): Promise<AbstractIntlMessages> {
  try {
    return (await importPath(locale)).default;
  } catch {
    // Fallback to English if locale doesn't exist
    return (await importPath("en")).default;
  }
}

const enMessages = (await import("@@/public/locales/en/common.json")).default;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  // Load the requested locale with automatic fallback to English if it doesn't exist
  const messages = await loadMessages(
    (loc) => import(`../../public/locales/${loc}/common.json`),
    locale
  );

  return {
    locale,
    messages,
    getMessageFallback({ namespace, key, error }) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) return "";
      const path = [namespace, key].filter(Boolean).join(".");

      // Helper to get nested value by path
      function getByPath(obj: Record<string, unknown>, path: string): unknown {
        return path.split(".").reduce<unknown>((acc, part) => {
          if (acc && typeof acc === "object" && part in acc) {
            return (acc as Record<string, unknown>)[part];
          }
          return undefined;
        }, obj);
      }

      // Try to get the fallback from English messages
      const fallback = getByPath(enMessages, path);

      // Return the fallback if found, otherwise the path
      return typeof fallback === "string" ? fallback : path;
    },
  };
});
