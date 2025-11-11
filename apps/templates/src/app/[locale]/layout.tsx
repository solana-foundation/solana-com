import { NextIntlClientProvider } from "next-intl";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";
import { loadMessages } from "@workspace/i18n/load-messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);

  // Load messages from both sources in parallel with automatic fallback to English
  const [webMessages, templatesMessages] = await Promise.all([
    loadMessages(
      (loc) =>
        import(`../../../../../apps/web/public/locales/${loc}/common.json`),
      locale,
    ),
    loadMessages(
      (loc) => import(`../../../public/locales/${loc}/common.json`),
      locale,
    ),
  ]);

  // Merge translations, with templates-specific taking precedence.
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
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}
