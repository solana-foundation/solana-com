"use client";

import Script from "next/script";
import { config } from "@/lib/config";

export const GTMTrackingSnippet = () => {
  const id = config.siteMetadata.googleTagManagerID;

  return (
    <>
      <Script strategy="afterInteractive" id="gtm-invocation">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${id}');
      `}
      </Script>

      {/* Default consent configuration */}
      <Script strategy="afterInteractive" id="gtag-invocation">
        {`
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
        var rawConsent = localStorage.getItem('cookie_consent');
        var parsedConsent = null;
        try {
          parsedConsent = JSON.parse(rawConsent || 'null');
        } catch (_) {
          parsedConsent = rawConsent;
        }
        var consentValue =
          typeof parsedConsent === 'boolean' ? parsedConsent :
          parsedConsent === 1 || parsedConsent === '1' || parsedConsent === 'true' ? true :
          parsedConsent === 0 || parsedConsent === '0' || parsedConsent === 'false' ? false :
          parsedConsent && typeof parsedConsent === 'object' && typeof parsedConsent.value === 'boolean' ? parsedConsent.value :
          null;
        window.gtag('js', new Date());
        window.gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied'
        });
        if (consentValue !== null) {
          window.gtag('consent', 'update', {
            'ad_storage': consentValue ? 'granted' : 'denied',
            'ad_user_data': consentValue ? 'granted' : 'denied',
            'ad_personalization': consentValue ? 'granted' : 'denied',
            'analytics_storage': consentValue ? 'granted' : 'denied'
          });
        }
        `}
      </Script>
    </>
  );
};
