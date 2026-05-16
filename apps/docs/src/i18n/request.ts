import { getRequestConfig } from "next-intl/server";
import {
  getEnglishFallbackMessages,
  getMessageFallback,
  loadMergedMessages,
  resolveLocale,
} from "@workspace/i18n/messages";

const enMessages = await getEnglishFallbackMessages("docs");

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);
  const messages = await loadMergedMessages({ app: "docs", locale });

  return {
    locale,
    messages,
    getMessageFallback: (ctx) => getMessageFallback(enMessages, ctx),
  };
});
