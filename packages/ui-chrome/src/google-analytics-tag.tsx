"use client";

import Script from "next/script";
import {
  getCookieConsentBootstrapScript,
  getCookieConsentDefaultScript,
} from "./cookie-consent";
import { isProductionAnalyticsEnabled } from "./analytics";

/**
 * The direct Google tag used by the primary Solana.com GA4 property.
 * Keep this separate from GTM containers: installing both for one destination
 * causes duplicate automatic page views.
 */
export function GoogleAnalyticsTag({
  measurementId,
}: {
  measurementId: string;
}) {
  if (!isProductionAnalyticsEnabled()) return null;

  return (
    <>
      <Script strategy="beforeInteractive" id="consent-default">
        {getCookieConsentDefaultScript()}
      </Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive" id="google-analytics-config">
        {getCookieConsentBootstrapScript({ gaMeasurementId: measurementId })}
      </Script>
    </>
  );
}
