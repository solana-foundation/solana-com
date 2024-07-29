import { ThemeProvider } from "../themecontext";
import "../scss/index.scss";
import SSRProvider from "react-bootstrap/SSRProvider";
import { appWithTranslation } from "next-i18next";
import SitewideTopAlert from "../components/sharedPageSections/SitewideTopAlert";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <SSRProvider>
      <GTMTrackingSnippet />
      <SitewideTopAlert locale={pageProps.builderLocale || "Default"} />
      <CookieConsent />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SSRProvider>
  );
};

export default appWithTranslation(App);
