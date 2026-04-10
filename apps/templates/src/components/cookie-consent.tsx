"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "@solana-com/ui-chrome";
import Link from "next/link";
import { Button } from "@workspace/ui";

export const CookieConsent = () => {
  const t = useTranslations();
  const { shouldShowBanner, setCookieConsent } = useCookieConsent();

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 w-full max-w-[400px] z-[9999] rounded border bg-black p-4 shadow-lg md:bottom-5 md:left-5 max-md:bottom-0 max-md:left-0 max-md:max-w-full max-md:rounded-none max-md:border-l-0 max-md:border-r-0 max-md:border-b-0">
      <div className="mb-3 text-sm">
        <p>{t("cookie-consent.title")}</p>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
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
  );
};
