import "@/scss/index.scss";
import "@/app/globals.css";
import { ThemeProvider } from "@/themecontext";
import initTranslations from "@/app/i18n";
import AppProvider from "./AppProvider";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import SitewideTopAlert from "@/components/sharedPageSections/SitewideTopAlert";
import { config } from "@/config";
import { RootProvider } from "fumadocs-ui/provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { locales } from "@/i18n";

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
    <html lang={locale}>
      <body>
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
        <ThemeProvider>
          <AppProvider
            namespaces={namespaces}
            locale={locale}
            resources={resources}
          >
            <RootProvider>
              <GTMTrackingSnippet />
              <SitewideTopAlert locale={builderLocale} />
              <CookieConsent />
              <Header containerClassName="container-docs" />
              {children}
              <Footer />
            </RootProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
