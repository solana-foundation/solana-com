import "@/app/globals.css";
import "@/scss/index.scss";

import CookieConsent from "@/components/CookieConsent/CookieConsent";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import { PostHogProvider } from "@@/src/app/components/posthog/PostHogProvider";
import { config } from "@@/src/config";
import { getBaseMetadata } from "@@/src/app/metadata";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";
import { headers } from "next/headers";
import {
  Header,
  Footer,
  ThemeProvider,
  SitewideTopAlert,
  InkeepChatButton,
} from "@solana-com/ui-chrome";
import Script from "next/script";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);
  // Load messages directly
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
  const headersList = await headers();
  const isCustomLayout = Boolean(headersList.get("x-custom-layout"));
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PostHogProvider>
            <ThemeProvider>
              <GTMTrackingSnippet />
              <SitewideTopAlert />
              <CookieConsent />
              {isCustomLayout ? null : <Header />}
              {children}
              {isCustomLayout ? null : <Footer />}
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
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getBaseMetadata(locale);
}
