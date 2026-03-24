import { getRequestConfig } from "next-intl/server";
import { routing } from "@workspace/i18n/routing";
import {
  getEnglishFallbackMessages,
  getMessageFallback,
  loadMergedMessages,
  resolveLocale,
} from "@workspace/i18n/messages";

const enMessages = await getEnglishFallbackMessages("web");

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale) ?? routing.defaultLocale;
  const messages = await loadMergedMessages({ app: "web", locale });

  return {
    locale,
    messages,
    getMessageFallback: (ctx) => getMessageFallback(enMessages, ctx),
  };
});
