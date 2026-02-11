import { ReactNode } from "react";
import Script from "next/script";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "@solana-com/ui-chrome";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";
import { Space_Grotesk } from "next/font/google";
import { getBaseMetadata } from "../metadata";
import { config } from "@@/src/config";
import { FlashSaleBanner } from "@@/src/components/FlashSaleBanner";
import "@@/src/scss/index.scss";
import "../globals.css";

const enMessages: AbstractIntlMessages = (
  await import("../../../public/locales/en/common.json")
).default;

/** Deep-merge locale messages on top of English so missing keys fall back to English. */
function deepMerge(
  base: AbstractIntlMessages,
  override: AbstractIntlMessages,
): AbstractIntlMessages {
  const result: AbstractIntlMessages = { ...base };
  for (const key of Object.keys(override)) {
    const bVal = base[key];
    const oVal = override[key];
    if (
      bVal &&
      oVal &&
      typeof bVal === "object" &&
      typeof oVal === "object" &&
      !Array.isArray(bVal) &&
      !Array.isArray(oVal)
    ) {
      result[key] = deepMerge(
        bVal as AbstractIntlMessages,
        oVal as AbstractIntlMessages,
      );
    } else if (oVal !== undefined) {
      // Don't let a stale primitive overwrite a structured English object
      if (typeof bVal === "object" && typeof oVal !== "object") continue;
      result[key] = oVal;
    }
  }
  return result;
}

// Load Space Grotesk font from Google Fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
  let messages = enMessages;
  if (locale !== "en") {
    try {
      const localeMessages: AbstractIntlMessages = (
        await import(`../../../public/locales/${locale}/common.json`)
      ).default;
      messages = deepMerge(enMessages, localeMessages);
    } catch {
      // Locale file doesn't exist — fall back to English
    }
  }

  // Structured data for Event schema
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.event.name,
    description: config.event.description,
    startDate: config.event.startDate,
    endDate: config.event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: config.event.location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: config.event.location.name,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Solana Foundation",
      url: "https://solana.com",
    },
    image: config.siteMetadata.socialShare,
    url: config.siteUrl,
  };

  return (
    <html
      lang={locale}
      dir={direction}
      className={`dark ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className={spaceGrotesk.className} suppressHydrationWarning>
        {/* Structured Data for Event (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventStructuredData, null, 2),
          }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1YDTXXYYQ4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1YDTXXYYQ4');
          `}
        </Script>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <FlashSaleBanner />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
