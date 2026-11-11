import type { ReactNode } from "react";
import type { AbstractIntlMessages } from "next-intl";
import localFont from "next/font/local";
import { getLangDir } from "rtl-detect";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { staticLocales } from "@workspace/i18n/config";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { getTranslations } from "@workspace/i18n/server";
import { CookieConsentBanner, GoogleAnalyticsTag } from "@solana-com/ui-chrome";
import { FabMenu } from "@@/src/components/FabMenu";
import { THEME_INIT_SCRIPT } from "@@/src/components/theme";
import { getBaseMetadata } from "../metadata";
import "../globals.css";

// Stand-in for Suisse Int'l until the licensed files are added. To switch,
// point these `path`s at the Suisse files; the CSS variable stays the same.
const bodyFont = localFont({
  src: [
    {
      path: "../../fonts/diatype/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/diatype/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bldr-body",
  display: "swap",
});

// The BLDR display face ("Solana Builder SF"), taken from the design studio's
// prototype. Replace with the supplied file when the asset toolkit arrives.
const displayFont = localFont({
  src: "../../fonts/bldr-slab/BLDRSlab-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-bldr-display",
  display: "swap",
});

// Motion starts from hidden states; without script, show everything.
const NO_SCRIPT_CSS =
  ".bldr-anim{transform:none!important;opacity:1!important;clip-path:none!important}";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "builder.metadata" });

  return getBaseMetadata(locale, {
    title: t("title"),
    description: t("description"),
    imageAlt: t("socialImageAlt"),
  });
}

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const messages = (await loadMergedMessages({
    app: "builder",
    locale,
  })) as AbstractIntlMessages;

  return (
    <html
      lang={locale}
      dir={getLangDir(locale)}
      data-bldr-theme="black"
      className={`dark ${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply a saved palette before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalyticsTag measurementId="G-1YDTXXYYQ4" />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <FabMenu />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
