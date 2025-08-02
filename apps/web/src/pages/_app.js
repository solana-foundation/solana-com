import { ThemeProvider } from "../themecontext";
import "../app/globals.css";
import "../scss/index.scss";
import { NextIntlClientProvider } from "next-intl";
import SitewideTopAlert from "../components/sharedPageSections/SitewideTopAlert";
import GTMTrackingSnippet from "../components/GTMTrackingSnippet";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import { InkeepChatButton } from "@/app/components/inkeep/inkeep-chat-button";

const App = ({ Component, pageProps: { messages, ...pageProps } }) => {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={pageProps.locale || "en"}
    >
      <GTMTrackingSnippet />
      <SitewideTopAlert locale={pageProps.builderLocale || "Default"} />
      <CookieConsent />
      <ThemeProvider>
        <Component {...pageProps} key={pageProps.key} />
        <InkeepChatButton />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default App;
