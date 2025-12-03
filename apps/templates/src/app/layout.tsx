import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { loadMessages } from "@workspace/i18n/load-messages";
import { getLangDir } from "rtl-detect";
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
  // Load English messages from both web and templates (templates overrides take precedence)
  const [webMessages, templatesMessages] = await Promise.all([
    loadMessages(
      (loc) => import(`../../apps/web/public/locales/${loc}/common.json`),
      locale,
    ),
    loadMessages(
      (loc) => import(`../public/locales/${loc}/common.json`),
      locale,
    ),
  ]);
  const messages = { ...webMessages, ...templatesMessages };

  return (
    <html
      lang={locale}
      dir={direction}
      className="dark"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <Header showLanguage={false} />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
