import "@/scss/index.scss";
import "@/app/globals.css";

import CookieConsent from "@/components/CookieConsent/CookieConsent";
import Footer from "@/components/Footer";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import Header from "@/components/Header";
import I18nProvider from "@/i18n/I18nProvider";
import { Metadata } from "next";
import { PostHogProvider } from "@/app/components/posthog/PostHogProvider";
import SitewideTopAlert from "@/components/sharedPageSections/SitewideTopAlert";
import { ThemeProvider } from "@/themecontext";
import { config } from "@/config";
import { getBaseMetadata } from "@/app/metadata";
import initTranslations from "@/i18n/translation";
import { staticLocales } from "@/i18n/config.cjs";

const namespaces = ["common"];

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;
  const { resources } = await initTranslations(locale, namespaces);
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
  const builderLocale = locale == "en" ? "Default" : locale;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <I18nProvider
          namespaces={namespaces}
          locale={locale}
          resources={resources}
        >
          <PostHogProvider>
            <ThemeProvider>
              <GTMTrackingSnippet />
              <SitewideTopAlert locale={builderLocale} />
              <CookieConsent />
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </PostHogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getBaseMetadata(locale);
}
