import "@/scss/index.scss";
import "@/app/globals.css";

import CookieConsent from "@/components/CookieConsent/CookieConsent";
import Footer from "@@/src/components/Footer";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import Header from "@@/src/components/Header";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import { PostHogProvider } from "@@/src/app/components/posthog/PostHogProvider";
import SitewideTopAlert from "@/components/sharedPageSections/SitewideTopAlert";
import { ThemeProvider } from "@/themecontext";
import { config } from "@@/src/config";
import { getBaseMetadata } from "@@/src/app/metadata";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";

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
  const builderLocale = locale == "en" ? "Default" : locale;
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
              <SitewideTopAlert locale={builderLocale} />
              <CookieConsent />
              <Header />
              {children}
              <Footer />
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
