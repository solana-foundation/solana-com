"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@workspace/ui";

type CookieConsentStore = {
  value: boolean;
  timeToExpire: number;
};

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
  builderNoTrack?: boolean;
};

const getLocalStorage = (key: string, defaultValue: boolean | null) => {
  const now = new Date().getTime();
  let sticky: CookieConsentStore | null = null;

  try {
    const stored = JSON.parse(
      localStorage.getItem(key) || "null",
    ) as CookieConsentStore | null;
    sticky = stored;
  } catch (error) {
    console.error(error);
  }

  if (sticky !== null) {
    if (now > sticky.timeToExpire) {
      localStorage.removeItem(key);
    }
    return sticky.value;
  }

  return defaultValue;
};

const setLocalStorage = (key: string, value: boolean) => {
  const now = new Date().getTime();
  const timeToExpire = 15778476000; // 6 months

  const obj = { value, timeToExpire: now + timeToExpire };
  localStorage.setItem(key, JSON.stringify(obj));
};

export const CookieConsent = () => {
  const t = useTranslations();
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const consent = getLocalStorage("cookie_consent", null);
    setCookieConsent(consent);
    setIsLoaded(true);

    if (typeof window !== "undefined" && consent !== null) {
      (window as WindowWithGtag).builderNoTrack = !consent;
    }
  }, []);

  useEffect(() => {
    const windowWithGtag = window as WindowWithGtag;

    if (typeof windowWithGtag.gtag !== "undefined" && isLoaded) {
      if (cookieConsent === null) {
        return;
      }

      setLocalStorage("cookie_consent", cookieConsent);
      windowWithGtag.gtag("consent", "update", {
        ad_storage: cookieConsent ? "granted" : "denied",
        ad_user_data: cookieConsent ? "granted" : "denied",
        ad_personalization: cookieConsent ? "granted" : "denied",
        analytics_storage: cookieConsent ? "granted" : "denied",
      });

      windowWithGtag.builderNoTrack = !cookieConsent;
    }
  }, [cookieConsent, isLoaded]);

  if (!isLoaded || cookieConsent !== null) {
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
