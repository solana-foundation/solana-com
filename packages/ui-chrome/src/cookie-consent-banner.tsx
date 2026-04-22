"use client";

import { useTranslations } from "next-intl";
import { Shield } from "react-feather";
import { Button } from "@workspace/ui";
import { useCookieConsent } from "./use-cookie-consent";
import { Link } from "./link";

export function CookieConsentBanner() {
  const t = useTranslations();
  const { isLoaded, setCookieConsent, shouldShowBanner } = useCookieConsent();

  if (!isLoaded) {
    return null;
  }

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[9999] w-[calc(100%-2.5rem)] max-w-[28rem] max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-w-full">
        <div className="relative overflow-hidden bg-zinc-950/95 p-5 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl max-md:rounded-none">
          <div className="relative space-y-4">
            <div className="flex items-start gap-3">
              <div className="px-2.5 text-emerald-300">
                <Shield className="size-5" />
              </div>
              <div className="space-y-2">
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
                  }}
                >
                  {t("cookie-consent.button.accept")}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="link"
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
    </>
  );
}
