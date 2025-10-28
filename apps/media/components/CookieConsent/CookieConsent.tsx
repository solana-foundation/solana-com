"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Get localstorage with expiry date
const getLocalStorage = function (key: string, defaultValue: any) {
  const now = new Date().getTime();
  let sticky = null;

  try {
    sticky = JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    console.error(error);
  }

  if (sticky !== null && sticky !== "undefined") {
    // remove stored consent value based on the expiration date
    if (now > sticky.timeToExpire) {
      localStorage.removeItem(key);
    }
    return sticky.value;
  }

  return defaultValue;
};

// Set localstorage with expiry date
const setLocalStorage = function (key: string, value: boolean) {
  const now = new Date().getTime();
  const timeToExpire = 15778476000; //6months

  const obj = { value, timeToExpire: now + timeToExpire };
  localStorage.setItem(key, JSON.stringify(obj));
};

export const CookieConsent = () => {
  const t = useTranslations();

  // cookieConsent is null by default
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // check if it has previously set within localStorage, or null otherwise
  useEffect(() => {
    const consent = getLocalStorage("cookie_consent", null);
    setCookieConsent(consent);
    setIsLoaded(true);

    // set builderNoTrack based on the previously set consent
    if (typeof window !== "undefined" && consent !== null) {
      (window as any).builderNoTrack = !consent;
    }
  }, []);

  // update when cookieConsent is changed via onClick
  useEffect(() => {
    if (
      typeof (window as any).gtag !== "undefined" &&
      cookieConsent !== null &&
      isLoaded
    ) {
      setLocalStorage("cookie_consent", cookieConsent);
      (window as any).gtag("consent", "update", {
        ad_storage: cookieConsent ? "granted" : "denied",
        ad_user_data: cookieConsent ? "granted" : "denied",
        ad_personalization: cookieConsent ? "granted" : "denied",
        analytics_storage: cookieConsent ? "granted" : "denied",
      });

      (window as any).builderNoTrack = !cookieConsent;
    }
  }, [cookieConsent, isLoaded]);

  return (
    <>
      {isLoaded && cookieConsent === null && (
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
                <a href="/privacy-policy#collection-of-information">
                  {t("cookie-consent.button.details")}
                </a>
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
