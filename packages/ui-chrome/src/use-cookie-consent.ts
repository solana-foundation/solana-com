"use client";

import { useEffect, useState } from "react";
import { getBrowserStorage } from "./browser-storage";
import {
  applyCookieConsent,
  type CookieConsentValue,
  type CookieConsentWindow,
  persistCookieConsent,
  readCookieConsent,
} from "./cookie-consent";

export const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState<CookieConsentValue>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storage = getBrowserStorage("localStorage");
    const consent = readCookieConsent({
      storage,
    });

    setCookieConsent(consent);
    setIsLoaded(true);

    if (consent !== null) {
      applyCookieConsent({
        value: consent,
        targetWindow: window as CookieConsentWindow,
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof cookieConsent !== "boolean") {
      return;
    }

    const storage = getBrowserStorage("localStorage");
    persistCookieConsent({
      storage,
      value: cookieConsent,
    });
    applyCookieConsent({
      value: cookieConsent,
      targetWindow: window as CookieConsentWindow,
    });
  }, [cookieConsent, isLoaded]);

  return {
    cookieConsent,
    isLoaded,
    setCookieConsent,
    shouldShowBanner: isLoaded && cookieConsent === null,
  };
};
