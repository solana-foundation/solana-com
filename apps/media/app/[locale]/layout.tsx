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
import { reader } from "@/lib/reader";
import { staticLocales } from "@workspace/i18n/config";
import { GTMTrackingSnippet } from "@/components/GTMTrackingSnippet";
import { CookieConsent } from "@/components/CookieConsent/CookieConsent";
import { config } from "@/lib/config";
import { loadMessages } from "@workspace/i18n/load-messages";

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
  const { siteMetadata, siteUrl, siteIcon, social } = config;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.title,
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      siteName: siteMetadata.title,
      title: siteMetadata.title,
      description: siteMetadata.shortDescription,
      images: [
        {
          url: siteMetadata.socialShare,
          width: 1200,
          height: 630,
          alt: siteMetadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      creator: siteMetadata.author,
      title: siteMetadata.title,
      description: siteMetadata.shortDescription,
      images: [siteMetadata.socialShare],
    },
    icons: {
      icon: siteIcon,
      shortcut: siteIcon,
      apple: siteIcon,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);

  // Load the requested locale with automatic fallback to English if it doesn't exist
  const messages = await loadMessages(
    (loc) => import(`../../public/locales/${loc}/common.json`),
    locale
  );

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
