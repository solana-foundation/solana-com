import { getRequestConfig } from "next-intl/server";
import { routing } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";
import { AbstractIntlMessages } from "next-intl";

const enMessages: AbstractIntlMessages = (
  await import("../../public/locales/en/common.json")
).default;

/** Deep-merge locale messages on top of English so every missing key falls back to English. */
function deepMerge(
  base: AbstractIntlMessages,
  override: AbstractIntlMessages,
): AbstractIntlMessages {
  const result: AbstractIntlMessages = { ...base };
  for (const key of Object.keys(override)) {
    const bVal = base[key];
    const oVal = override[key];
    if (
      bVal &&
      oVal &&
      typeof bVal === "object" &&
      typeof oVal === "object" &&
      !Array.isArray(bVal) &&
      !Array.isArray(oVal)
    ) {
      result[key] = deepMerge(
        bVal as AbstractIntlMessages,
        oVal as AbstractIntlMessages,
      );
    } else if (oVal !== undefined) {
      // Don't let a stale primitive overwrite a structured English object
      if (typeof bVal === "object" && typeof oVal !== "object") continue;
      result[key] = oVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  let messages = enMessages;

  if (locale !== "en") {
    try {
      const localeMessages: AbstractIntlMessages = (
        await import(`../../public/locales/${locale}/common.json`)
      ).default;
      messages = deepMerge(enMessages, localeMessages);
    } catch {
      // Locale file doesn't exist — fall back to English
    }
  }

  return {
    locale,
    messages,
  };
});
