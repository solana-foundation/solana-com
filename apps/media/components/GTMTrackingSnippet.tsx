"use client";

import Script from "next/script";
import {
  getCookieConsentBootstrapScript,
  getCookieConsentDefaultScript,
  isProductionAnalyticsEnabled,
} from "@solana-com/ui-chrome";
import { config } from "@/lib/config";

export const GTMTrackingSnippet = () => {
  if (!isProductionAnalyticsEnabled()) return null;

  const id = config.siteMetadata.googleTagManagerID;
  return (
    <>
      <Script strategy="beforeInteractive" id="consent-default">
        {getCookieConsentDefaultScript()}
      </Script>
      <Script strategy="afterInteractive" id="gtm-invocation">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${id}');
      `}
      </Script>
      <Script strategy="afterInteractive" id="gtag-invocation">
        {getCookieConsentBootstrapScript()}
      </Script>
    </>
  );
};
