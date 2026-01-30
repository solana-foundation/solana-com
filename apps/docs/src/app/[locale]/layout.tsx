import "@/scss/index.scss";
import "@/app/globals.css";

import CookieConsent from "@/components/CookieConsent/CookieConsent";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import { PostHogProvider } from "@@/src/app/components/posthog/PostHogProvider";
import { config } from "@@/src/config";
import { getBaseMetadata } from "@@/src/app/metadata";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";
import {
  Header,
  Footer,
  ThemeProvider,
  SitewideTopAlert,
} from "@solana-com/ui-chrome";
import { loadMessages } from "@workspace/i18n/load-messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);
  // Load messages from both sources in parallel with automatic fallback to English
  const [webMessages, docsMessages] = await Promise.all([
    loadMessages(
      (loc) =>
        import(`../../../../../apps/web/public/locales/${loc}/common.json`),
      locale,
    ),
    loadMessages(
      (loc) => import(`@@/public/locales/${loc}/common.json`),
      locale,
    ),
  ]);

  // Merge translations, with docs-specific taking precedence.
  const messages = { ...webMessages, ...docsMessages };
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
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
