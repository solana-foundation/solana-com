"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "@solana-com/ui-chrome";
import { Button } from "@/components/ui/button";
import { Link } from "@workspace/i18n/routing";

export const CookieConsent = () => {
  const t = useTranslations();
  const { shouldShowBanner, setCookieConsent } = useCookieConsent();

  return (
    <>
      {shouldShowBanner && (
        <div className="fixed bottom-5 left-5 w-full max-w-[400px] z-[9999] border bg-black p-4 rounded shadow-lg md:bottom-5 md:left-5 max-md:bottom-0 max-md:left-0 max-md:max-w-full max-md:rounded-none max-md:border-l-0 max-md:border-r-0 max-md:border-b-0">
          <div className="text-sm mb-3">
            <p>{t("cookie-consent.title")}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto"
                onClick={() => setCookieConsent(false)}
              >
                {t("cookie-consent.button.optout")}
              </Button>
              <Button variant="ghost" size="sm" className="h-auto" asChild>
                <Link href="/privacy-policy#collection-of-information">
                  {t("cookie-consent.button.details")}
                </Link>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full !bg-black text-white"
              onClick={() => setCookieConsent(true)}
            >
              {t("cookie-consent.button.accept")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
