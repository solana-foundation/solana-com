"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Shield } from "react-feather";
import { Button } from "@workspace/ui";
import { useCookieConsent } from "./use-cookie-consent";
import { Link } from "./link";

export function CookieConsentBanner() {
  const t = useTranslations();
  const { cookieConsent, isLoaded, setCookieConsent, shouldShowBanner } =
    useCookieConsent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (shouldShowBanner) {
      setIsOpen(true);
    }
  }, [shouldShowBanner]);

  if (!isLoaded) {
    return null;
  }

  const showBanner = shouldShowBanner || isOpen;

  return (
    <>
      {showBanner ? (
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

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-full border-white/14 bg-white/6 px-4 text-sm font-semibold text-white hover:border-rose-300/40 hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      setCookieConsent(false);
                      setIsOpen(false);
                    }}
                  >
                    {t("cookie-consent.button.optout")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-full border-white/14 bg-white/6 px-4 text-sm font-semibold text-white hover:border-emerald-300/40 hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      setCookieConsent(true);
                      setIsOpen(false);
                    }}
                  >
                    {t("cookie-consent.button.accept")}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
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
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {cookieConsent !== null && !isOpen ? (
        <div className="fixed bottom-5 left-5 z-[9998] max-md:bottom-4 max-md:left-4">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-white/12 bg-zinc-950/90 px-3 text-xs font-medium text-white shadow-[0_18px_48px_-28px_rgba(0,0,0,0.85)] backdrop-blur-xl hover:border-cyan-300/40 hover:bg-zinc-900 hover:text-white"
            onClick={() => setIsOpen(true)}
          >
            <Shield className="size-3.5" />
            {t("cookie-consent.button.manage")}
          </Button>
        </div>
      ) : null}
    </>
  );
}
