"use client";

import { useEffect, useState } from "react";
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
    const consent = readCookieConsent({
      storage: window.localStorage,
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
    if (!isLoaded || cookieConsent === null) {
      return;
    }

    persistCookieConsent({
      storage: window.localStorage,
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
