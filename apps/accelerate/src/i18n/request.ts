import { getRequestConfig } from "next-intl/server";
import { loadMergedMessages, resolveLocale } from "@workspace/i18n/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLocale(await requestLocale);
  const messages = await loadMergedMessages({ app: "accelerate", locale });

  return {
    locale,
    messages,
  };
});
