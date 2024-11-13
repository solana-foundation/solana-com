import "../scss/index.scss";
import "./globals.css";
import { ThemeProvider } from "../themecontext";
import initTranslations from "./i18n";
import AppProvider from "./AppProvider";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import { config } from "@/config";
import { RootProvider } from "fumadocs-ui/provider";

const namespaces = ["common"];
const locale = "en";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resources } = await initTranslations(locale, namespaces);

  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
  return (
    <html lang="en">
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
              <CookieConsent />
              {children}
            </RootProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
