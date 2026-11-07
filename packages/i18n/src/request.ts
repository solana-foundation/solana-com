import type { AbstractIntlMessages } from "next-intl";
import type { GetRequestConfigParams, RequestConfig } from "next-intl/server";
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

  // Deliberately not wrapped in next-intl's `getRequestConfig` (an identity
  // function): importing next-intl/server here closes a cycle through its
  // `next-intl/config` alias, and after an HMR rebuild the import can be read
  // before it is initialised ("Cannot read properties of undefined").
  return async ({
    requestLocale,
  }: GetRequestConfigParams): Promise<RequestConfig> => {
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
  };
}
