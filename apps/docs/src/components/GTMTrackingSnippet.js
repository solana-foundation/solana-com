"use client";

import Script from "next/script";
import { config } from "src/config";

const GTMTrackingSnippet = () => {
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

      {/* The consent */}
      <Script strategy="afterInteractive" id="gtag-invocation">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied'
        });
        `}
      </Script>
    </>
  );
};

export default GTMTrackingSnippet;
