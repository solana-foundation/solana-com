import React from "react";
import { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";
import { NextIntlClientProvider } from "next-intl";
import { getLangDir } from "rtl-detect";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { LayoutProvider } from "@/components/layout/layout-context";
import client from "@/tina/__generated__/client";
import { staticLocales } from "@workspace/i18n/config";
import { GTMTrackingSnippet } from "@/components/GTMTrackingSnippet";
import { CookieConsent } from "@/components/CookieConsent/CookieConsent";
import { config } from "@/lib/config";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

const fontSans = localFont({
  src: [
    {
      path: "../../fonts/ABCDiatype-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-ThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-RegularItalic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/ABCDiatype-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/ABCDiatype-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Solana Media",
    description: "Solana Media - News, Podcasts, and More",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale = "en" } = await params;

  // Validate locale - fallback to "en" if invalid
  const locale = staticLocales.includes(rawLocale) ? rawLocale : "en";
  const direction = getLangDir(locale);

  // Load locale messages with fallback
  let messages;
  try {
    messages = (await import(`../../public/locales/${locale}/common.json`))
      .default;
  } catch {
    messages = (await import(`../../public/locales/en/common.json`)).default;
  }

  // Fetch global data for LayoutProvider
  const { data: globalData } = await client.queries.global(
    {
      relativePath: "index.json",
    },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      },
    }
  );

  const googleTagManagerID = config.siteMetadata.googleTagManagerID;

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(fontSans.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
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
                <main className="overflow-x-hidden">{children}</main>
                <Footer />
                <VideoDialog />
              </VideoDialogProvider>
            </LayoutProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}
