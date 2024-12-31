import { ThemeProvider } from "../themecontext";
import "../scss/index.scss";
import { appWithTranslation } from "next-i18next";
import SitewideTopAlert from "../components/sharedPageSections/SitewideTopAlert";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import { NextIntlClientProvider } from "next-intl";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <NextIntlClientProvider locale={pageProps.locale}>
        <GTMTrackingSnippet />
        <SitewideTopAlert locale={pageProps.builderLocale || "Default"} />
        <CookieConsent />
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
};

export default appWithTranslation(App);
