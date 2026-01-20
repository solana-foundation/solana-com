import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { loadMessages } from "@workspace/i18n/load-messages";
import { getLangDir } from "rtl-detect";
import "../scss/index.scss";
import "./globals.css";

export const metadata = {
  title: "Solana Accelerate APAC - Hong Kong",
  description:
    "Join us at Solana Accelerate APAC in Hong Kong on February 19, 2025. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.",
  openGraph: {
    title: "Solana Accelerate APAC - Hong Kong",
    description:
      "Join us at Solana Accelerate APAC in Hong Kong on February 19, 2025.",
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
      className="dark"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <Header showLanguage={false} showDevelopersNav={false} />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
