import { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locales } from "@workspace/i18n/config";
import { routing } from "@workspace/i18n/routing";
import { loadMessages } from "@workspace/i18n/load-messages";
import type { AppMessages } from "@/content/page";

const enMessages = (await import("../../public/locales/en/common.json"))
  .default as AppMessages;

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>,
): T {
  const result = { ...base } as T;

  for (const key of Object.keys(override)) {
    const baseValue = base[key];
    const overrideValue = override[key as keyof T];

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      result[key as keyof T] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>,
      ) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key as keyof T] = overrideValue as T[keyof T];
    }
  }

  return result;
}

export async function loadBreakpointMessages(requested?: string | null) {
  const locale =
    requested && locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  const localeMessages = (await loadMessages(
    (loc) => import(`../../public/locales/${loc}/common.json`),
    locale,
  )) as unknown as AppMessages;

  return {
    locale,
    messages:
      locale === "en" ? enMessages : deepMerge(enMessages, localeMessages),
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const resolved = await loadBreakpointMessages(requested);

  return {
    locale: resolved.locale,
    messages: resolved.messages as unknown as AbstractIntlMessages,
  };
});
