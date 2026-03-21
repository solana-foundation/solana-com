import { getRequestConfig } from "next-intl/server";
import {
  getEnglishFallbackMessages,
  getMessageFallback,
  loadMergedMessages,
  resolveLocale,
} from "@workspace/i18n/messages";

const enMessages = await getEnglishFallbackMessages("templates");

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);
  const messages = await loadMergedMessages({ app: "templates", locale });

  return {
    locale,
    messages,
    getMessageFallback: (ctx) => getMessageFallback(enMessages, ctx),
  };
});
