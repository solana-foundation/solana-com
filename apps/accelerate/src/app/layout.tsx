import { ReactNode } from "react";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@solana-com/ui-chrome";
import { loadMessages } from "@workspace/i18n/load-messages";
import { getLangDir } from "rtl-detect";
import { Space_Grotesk } from "next/font/google";
import { getBaseMetadata } from "./metadata";
import { config } from "@@/src/config";
import "../scss/index.scss";
import "./globals.css";

// Load Space Grotesk font from Google Fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const locale = "en";

export const metadata = getBaseMetadata(locale);

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const direction = getLangDir(locale);
  const accelerateMessages = await loadMessages(
    (loc) => import(`../../public/locales/${loc}/common.json`),
    locale,
  );
  const messages = { ...accelerateMessages };

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
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
