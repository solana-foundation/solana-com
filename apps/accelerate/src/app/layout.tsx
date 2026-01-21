import { ReactNode } from "react";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@solana-com/ui-chrome";
import { loadMessages } from "@workspace/i18n/load-messages";
import { getLangDir } from "rtl-detect";
import { Space_Grotesk } from "next/font/google";
import "../scss/index.scss";
import "./globals.css";

// Load Space Grotesk font from Google Fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "Solana Accelerate APAC - Hong Kong",
  description:
    "Join us at Solana Accelerate APAC in Hong Kong on February 11, 2026. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.",
  openGraph: {
    title: "Solana Accelerate APAC - Hong Kong",
    description:
      "Join us at Solana Accelerate APAC in Hong Kong on February 11, 2026.",
    type: "website",
  },
};

type Props = {
  children: ReactNode;
};

const locale = "en";

export default async function RootLayout({ children }: Props) {
  const direction = getLangDir(locale);
  const accelerateMessages = await loadMessages(
    (loc) => import(`../../public/locales/${loc}/common.json`),
    locale,
  );
  const messages = { ...accelerateMessages };

  return (
    <html
      lang={locale}
      dir={direction}
      className={`dark ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className={spaceGrotesk.className} suppressHydrationWarning>
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
