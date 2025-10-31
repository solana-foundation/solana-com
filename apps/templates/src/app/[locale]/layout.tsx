import { NextIntlClientProvider } from "next-intl";
import { Header, Footer, ThemeProvider } from "@solana-com/ui-chrome";
import { staticLocales } from "@workspace/i18n/config";
import { getLangDir } from "rtl-detect";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const direction = getLangDir(locale);

  // Load messages from main web app (shared translations)
  let webMessages;
  try {
    webMessages = (
      await import(
        `../../../../../apps/web/public/locales/${locale}/common.json`
      )
    ).default;
  } catch (error) {
    // Fallback to English if locale doesn't exist
    webMessages = (
      await import(`../../../../../apps/web/public/locales/en/common.json`)
    ).default;
  }

  // Load templates-specific messages
  let templatesMessages;
  try {
    templatesMessages = (
      await import(`../../../public/locales/${locale}/common.json`)
    ).default;
  } catch (error) {
    // Fallback to English if locale doesn't exist
    templatesMessages = (await import(`../../../public/locales/en/common.json`))
      .default;
  }

  // Merge translations, with templates-specific taking precedence
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
