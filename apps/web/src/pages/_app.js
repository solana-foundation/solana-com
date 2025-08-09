import { ThemeProvider } from "../themecontext";
import "../app/globals.css";
import "../scss/index.scss";
import { NextIntlClientProvider } from "next-intl";
import SitewideTopAlert from "../components/sharedPageSections/SitewideTopAlert";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import { InkeepChatButton } from "@/app/components/inkeep/inkeep-chat-button";
import Script from "next/script";

const App = ({ Component, pageProps: { messages, ...pageProps } }) => {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={pageProps.locale || "en"}
    >
      <GTMTrackingSnippet />
      <SitewideTopAlert locale={pageProps.builderLocale || "Default"} />
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
                script.src = 'https://cdn.cr-relay.com/v1/site/1b843333-8295-4384-b6a6-35a414f5289d/signals.js';
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
