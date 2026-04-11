"use client";

import { useTranslations } from "next-intl";
import { Shield } from "react-feather";
import { Button } from "@workspace/ui";
import { Link } from "./link";
import { useCookieConsent } from "./cookie-consent";

export function CookieConsentBanner() {
  const t = useTranslations();
  const { shouldShowBanner, setCookieConsent } = useCookieConsent();

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-[9999] w-[calc(100%-2.5rem)] max-w-[28rem] max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-w-full">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-zinc-950/95 p-5 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl max-md:rounded-none max-md:border-x-0 max-md:border-b-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-300/80 to-cyan-300/0" />

        <div className="relative space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-emerald-300">
              <Shield className="size-4" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
              </div>
              <p className="max-w-[24rem] text-sm leading-6 text-white/88">
                {t("cookie-consent.title")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto rounded-full px-0 text-xs font-medium text-white/72 hover:bg-transparent hover:text-white"
                onClick={() => setCookieConsent(false)}
              >
                {t("cookie-consent.button.optout")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-white/14 bg-white/6 px-3 text-xs text-white hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/privacy-policy#collection-of-information">
                  {t("cookie-consent.button.details")}
                </Link>
              </Button>
            </div>

            <Button
              size="sm"
              className="h-9 rounded-full border border-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 px-4 text-sm font-semibold text-zinc-950 shadow-[0_12px_32px_-16px_rgba(34,211,238,0.9)] transition-transform hover:scale-[1.01] hover:from-emerald-300 hover:via-cyan-300 hover:to-indigo-300"
              onClick={() => setCookieConsent(true)}
            >
              {t("cookie-consent.button.accept")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
