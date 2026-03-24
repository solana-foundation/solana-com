import React from "react";
import { Metadata } from "next";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";
import { NextIntlClientProvider } from "next-intl";
import { getLangDir } from "rtl-detect";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { LayoutProvider } from "@/components/layout/layout-context";
import { reader } from "@/lib/reader";
import { staticLocales } from "@workspace/i18n/config";
import { GTMTrackingSnippet } from "@/components/GTMTrackingSnippet";
import { CookieConsent } from "@/components/CookieConsent/CookieConsent";
import { config } from "@/lib/config";
import { mediaSeo } from "@/lib/seo";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return mediaSeo.getBaseMetadata({
    locale,
    alternates: {
      canonical: config.publicUrl,
    },
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);

  const messages = await loadMergedMessages({ app: "media", locale });

  // Fetch global data for LayoutProvider
  const globalSettings = await reader.singletons.global.read();
  const globalData = {
    global: globalSettings
      ? {
          theme: {
            color: globalSettings.theme?.color || null,
            darkMode: globalSettings.theme?.darkMode || "system",
          },
        }
      : null,
  };

  const googleTagManagerID = config.siteMetadata.googleTagManagerID;

  return (
    <div dir={direction} suppressHydrationWarning>
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
        <ThemeProvider>
          <GTMTrackingSnippet />
          <CookieConsent />
          <LayoutProvider globalSettings={globalData.global} pageData={null}>
            <VideoDialogProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <VideoDialog />
            </VideoDialogProvider>
          </LayoutProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
      <TailwindIndicator />
    </div>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}
