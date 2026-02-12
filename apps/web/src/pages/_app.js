import {
  ThemeProvider,
  InkeepChatButton,
  SitewideTopAlert,
} from "@solana-com/ui-chrome";
import "../app/globals.css";
import "../scss/index.scss";
import { NextIntlClientProvider } from "next-intl";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import Script from "next/script";

const App = ({ Component, pageProps: { messages, ...pageProps } }) => {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={pageProps.locale || "en"}
    >
      <GTMTrackingSnippet />
      <SitewideTopAlert />
      <CookieConsent />
      <ThemeProvider>
        <Component {...pageProps} key={pageProps.key} />
        <InkeepChatButton />
        <Script
          id="signals-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                if (typeof window.signals !== 'undefined') return;
                var script = document.createElement('script');
                script.src = 'https://cdn.cr-relay.com/v1/site/d7901f15-da9a-4a7a-bf5e-679354ce2f55/signals.js';
                script.async = true;
                window.signals = Object.assign(
                  [],
                  ['page', 'identify', 'form'].reduce(function (acc, method){
                    acc[method] = function () {
                      signals.push([method, arguments]);
                      return signals;
                    };
                   return acc;
                  }, {})
                );
                document.head.appendChild(script);
              })();
            `,
          }}
        />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default App;
