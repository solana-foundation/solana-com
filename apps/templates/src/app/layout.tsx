import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  Header,
  Footer,
  PersistentPodcastPlayer,
  ThemeProvider,
} from "@solana-com/ui-chrome";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { getLangDir } from "rtl-detect";
import { config } from "@/config";
import { GTMTrackingSnippet } from "@/components/gtm-tracking-snippet";
import { CookieConsent } from "@/components/cookie-consent";
import "../scss/index.scss";
import "./globals.css";

export const metadata = {
  title: "Solana Developer Templates",
  description:
    "Build faster with production-ready templates for dApps, DeFi protocols, NFT marketplaces, and more.",
};

type Props = {
  children: ReactNode;
};

const locale = "en";

export default async function RootLayout({ children }: Props) {
  const direction = getLangDir(locale);
  const messages = await loadMergedMessages({ app: "templates", locale });
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;

  return (
    <html
      lang={locale}
      dir={direction}
      className="dark"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <GTMTrackingSnippet />
            <CookieConsent />
            <Header showLanguage={false} showDevelopersNav={false} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <PersistentPodcastPlayer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
