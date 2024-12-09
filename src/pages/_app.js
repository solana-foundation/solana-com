import { ThemeProvider } from "../themecontext";
import "../scss/index.scss";
import { appWithTranslation } from "next-i18next";
import SitewideTopAlert from "../components/sharedPageSections/SitewideTopAlert";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <GTMTrackingSnippet />
      <SitewideTopAlert locale={pageProps.builderLocale || "Default"} />
      <CookieConsent />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default appWithTranslation(App);
