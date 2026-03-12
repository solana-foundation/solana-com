import React from "react";
import { Metadata } from "next";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";
import { NextIntlClientProvider } from "next-intl";
import { getLangDir } from "rtl-detect";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { LayoutProvider } from "@/components/layout/layout-context";
import { reader } from "@/lib/reader";
import { staticLocales } from "@workspace/i18n/config";
import { GTMTrackingSnippet } from "@/components/GTMTrackingSnippet";
import { CookieConsent } from "@/components/CookieConsent/CookieConsent";
import { config } from "@/lib/config";
import { loadMessages } from "@workspace/i18n/load-messages";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { siteMetadata, publicUrl, siteIcon, social } = config;

  return {
    metadataBase: new URL(publicUrl),
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
      url: publicUrl,
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
      apple: appleTouchIcon.src,
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
      canonical: publicUrl,
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
              <main className="overflow-x-hidden">{children}</main>
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
