import { AbstractIntlMessages, IntlErrorCode } from "next-intl";
import { defaultLocale, locales } from "./config";
import { loadMessages } from "./load-messages";

type MessageModule = { default: AbstractIntlMessages };

export type AppId =
  | "web"
  | "docs"
  | "accelerate"
  | "media"
  | "breakpoint"
  | "templates";

type MessageLoader = (locale: string) => Promise<MessageModule>;

const appMessageLoaders: Partial<Record<AppId, MessageLoader>> = {
  web: (locale) => import(`../messages/web/${locale}/common.json`),
  accelerate: (locale) =>
    import(`../messages/accelerate/${locale}/common.json`),
  media: (locale) => import(`../messages/media/${locale}/common.json`),
  templates: (locale) => import(`../messages/templates/${locale}/common.json`),
};

const appInheritance: Record<AppId, AppId[]> = {
  web: [],
  docs: ["web"],
  accelerate: ["web"],
  media: ["web"],
  breakpoint: ["web"],
  templates: ["web"],
};

export function resolveLocale(requested?: string | null) {
  return requested && locales.includes(requested) ? requested : defaultLocale;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function deepMergeMessages<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>,
): T {
  const result = { ...base } as T;

  for (const key of Object.keys(override)) {
    const baseValue = base[key];
    const overrideValue = override[key as keyof T];

    if (isRecord(baseValue) && isRecord(overrideValue)) {
      result[key as keyof T] = deepMergeMessages(
        baseValue,
        overrideValue,
      ) as T[keyof T];
      continue;
    }

    if (overrideValue === undefined) {
      continue;
    }

    // Avoid a stale primitive replacing a structured message subtree.
    if (isRecord(baseValue) && !isRecord(overrideValue)) {
      continue;
    }

    result[key as keyof T] = overrideValue as T[keyof T];
  }

  return result;
}

async function loadRawMessages(
  app: AppId,
  locale: string,
): Promise<AbstractIntlMessages> {
  const loader = appMessageLoaders[app];

  if (!loader) {
    return {};
  }

  return loadMessages(loader, locale);
}

export async function loadAppMessages(
  app: AppId,
  locale: string,
): Promise<AbstractIntlMessages> {
  const englishMessages = await loadRawMessages(app, defaultLocale);

  if (locale === defaultLocale) {
    return englishMessages;
  }

  const localeMessages = await loadRawMessages(app, locale);
  return deepMergeMessages(
    englishMessages as Record<string, unknown>,
    localeMessages as Record<string, unknown>,
  ) as AbstractIntlMessages;
}

export async function loadMergedMessages({
  app,
  locale,
  inheritFrom = appInheritance[app],
}: {
  app: AppId;
  locale: string;
  inheritFrom?: AppId[];
}): Promise<AbstractIntlMessages> {
  const merged = {} as Record<string, unknown>;

  for (const inheritedApp of inheritFrom) {
    Object.assign(
      merged,
      deepMergeMessages(
        merged,
        (await loadMergedMessages({
          app: inheritedApp,
          locale,
          inheritFrom: appInheritance[inheritedApp],
        })) as Record<string, unknown>,
      ),
    );
  }

  return deepMergeMessages(
    merged,
    (await loadAppMessages(app, locale)) as Record<string, unknown>,
  ) as AbstractIntlMessages;
}

export async function getEnglishFallbackMessages(app: AppId) {
  return loadMergedMessages({ app, locale: defaultLocale });
}

export function getMessageFallback(
  englishMessages: AbstractIntlMessages,
  {
    namespace,
    key,
    error,
  }: {
    namespace?: string;
    key: string;
    error: { code?: IntlErrorCode };
  },
) {
  if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
    return "";
  }

  const path = [namespace, key].filter(Boolean).join(".");
  const fallback = path.split(".").reduce<unknown>((acc, part) => {
    if (isRecord(acc) && part in acc) {
      return acc[part];
    }

    return undefined;
  }, englishMessages);

  return typeof fallback === "string" ? fallback : path;
}
