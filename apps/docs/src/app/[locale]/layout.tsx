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
import { NextProvider } from "fumadocs-core/framework/next";
import {
  Header,
  Footer,
  PersistentPodcastPlayer,
  ThemeProvider,
  SitewideTopAlert,
  GoogleTagManagerNoScript,
} from "@solana-com/ui-chrome";
import { loadMergedMessages } from "@workspace/i18n/messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);
  const messages = await loadMergedMessages({ app: "docs", locale });
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleTagManagerNoScript containerId={googleTagManagerID} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextProvider>
            <PostHogProvider>
              <ThemeProvider>
                <GTMTrackingSnippet />
                <SitewideTopAlert />
                <CookieConsent />
                <Header />
                {children}
                <Footer />
                <PersistentPodcastPlayer />
              </ThemeProvider>
            </PostHogProvider>
          </NextProvider>
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
