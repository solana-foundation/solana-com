"use client";

import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
  type CookieConsentValue,
} from "@solana-com/ui-chrome";

import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const hasInitialized = useRef(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      console.debug("PostHog analytics disabled");
      return;
    }

    const syncPostHogConsent = (consent: CookieConsentValue) => {
      if (consent === true) {
        if (!hasInitialized.current) {
          posthog.init(apiKey, {
            api_host: "https://us.i.posthog.com",
            capture_pageview: false,
            capture_pageleave: true,
          });
          hasInitialized.current = true;
        }

        if (typeof posthog.opt_in_capturing === "function") {
          posthog.opt_in_capturing();
        }

        setIsEnabled(true);
        return;
      }

      if (
        hasInitialized.current &&
        typeof posthog.opt_out_capturing === "function"
      ) {
        posthog.opt_out_capturing();
      }

      setIsEnabled(false);
    };

    syncPostHogConsent(
      readCookieConsent({
        storage: window.localStorage,
      }),
    );

    const handleConsentChange = (
      event: Event | CustomEvent<{ value?: boolean }>,
    ) => {
      const consent = "detail" in event ? event.detail?.value : undefined;
      syncPostHogConsent(
        typeof consent === "boolean"
          ? consent
          : readCookieConsent({
              storage: window.localStorage,
            }),
      );
    };

    window.addEventListener(
      COOKIE_CONSENT_EVENT,
      handleConsentChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_EVENT,
        handleConsentChange as EventListener,
      );
    };
  }, [apiKey]);

  if (!apiKey || !isEnabled) {
    return children;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) {
        url += "?" + search;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
