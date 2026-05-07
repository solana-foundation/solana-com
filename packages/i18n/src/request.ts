import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "./server";
import {
  getEnglishFallbackMessages,
  getMessageFallback,
  loadMergedMessages,
  resolveLocale,
  type AppId,
} from "./messages";

export async function loadAppRequestMessages<
  T extends AbstractIntlMessages = AbstractIntlMessages,
>(app: AppId, requested?: string | null) {
  const locale = resolveLocale(requested);
  const messages = (await loadMergedMessages({
    app,
    locale,
  })) as T;

  return {
    locale,
    messages,
  };
}

export function createAppRequestConfig(app: AppId) {
  let englishMessagesPromise:
    | ReturnType<typeof getEnglishFallbackMessages>
    | undefined;

  return getRequestConfig(async ({ requestLocale }) => {
    const { locale, messages } = await loadAppRequestMessages(
      app,
      await requestLocale,
    );

    englishMessagesPromise ??= getEnglishFallbackMessages(app);
    const englishMessages = await englishMessagesPromise;

    return {
      locale,
      messages,
      getMessageFallback: (ctx) => getMessageFallback(englishMessages, ctx),
    };
  });
}
