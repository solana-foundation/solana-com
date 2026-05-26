import { ReactNode } from "react";
import Script from "next/script";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import {
  CookieConsentBanner,
  getCookieConsentBootstrapScript,
  getCookieConsentDefaultScript,
  PersistentPodcastPlayer,
  ThemeProvider,
} from "@solana-com/ui-chrome";
import { FabMenu } from "@@/src/components/FabMenu";
import { staticLocales } from "@workspace/i18n/config";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { getLangDir } from "rtl-detect";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { getBaseMetadata } from "../metadata";
import "@@/src/scss/index.scss";
import "../globals.css";

// Load Space Grotesk font from Google Fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Load ABC Diatype font locally
const abcDiatype = localFont({
  src: [
    {
      path: "../../fonts/diatype/ABCDiatype-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-diatype",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getBaseMetadata(locale);
}

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);
  const messages = (await loadMergedMessages({
    app: "accelerate",
    locale,
  })) as AbstractIntlMessages;

  return (
    <html
      lang={locale}
      dir={direction}
      className={`dark ${spaceGrotesk.variable} ${abcDiatype.variable}`}
      suppressHydrationWarning
    >
      <body className={spaceGrotesk.className} suppressHydrationWarning>
        <Script strategy="beforeInteractive" id="consent-default">
          {getCookieConsentDefaultScript()}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1YDTXXYYQ4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {getCookieConsentBootstrapScript({
            gaMeasurementId: "G-1YDTXXYYQ4",
          })}
        </Script>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <main className="min-h-screen">{children}</main>
            <FabMenu />
            <CookieConsentBanner />
            <PersistentPodcastPlayer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
