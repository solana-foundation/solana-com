import { getRequestConfig } from "next-intl/server";
import { AbstractIntlMessages } from "next-intl";
import { loadMergedMessages, resolveLocale } from "@workspace/i18n/messages";
import type { AppMessages } from "@/content/page";

export async function loadBreakpointMessages(requested?: string | null) {
  const locale = resolveLocale(requested);
  const messages = (await loadMergedMessages({
    app: "breakpoint",
    locale,
  })) as AppMessages;

  return {
    locale,
    messages,
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
