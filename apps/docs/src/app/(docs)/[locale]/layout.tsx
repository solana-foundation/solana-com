import "@/app/globals.css";
import "@workspace/ui/scrollbar.css";
import "@/scss/index.scss";

import { Metadata } from "next";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import { getLangDir } from "rtl-detect";
import { getDocsBaseMetadata } from "@@/src/app/metadata";
import { config } from "@@/src/config";
import { locales, staticLocales } from "@workspace/i18n/config";
import { loadMergedMessages } from "@workspace/i18n/messages";
import { notFound } from "next/navigation";
import CookieConsent from "@/components/CookieConsent/CookieConsent";
import GTMTrackingSnippet from "@/components/GTMTrackingSnippet";
import {
  GoogleTagManagerNoScript,
  PersistentPodcastPlayer,
  SitewideTopAlert,
} from "@solana-com/ui-chrome";
import { DocsAssistant } from "@/components/docs/docs-assistant.client";
import { DOCS_ASK_PREPAINT_SCRIPT } from "@/lib/docs/ask/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Root layout of the /developers landing and the docs (/developers/docs,
 * /developers/cookbook, /learn/<article>). They wear the docs header and
 * footer, so the site Header and Footer are left out, and the client gets
 * only the messages its components read (cookie banner, landing calculator,
 * newsletter form, Ask AI and Inkeep), not the whole site's. The assistant
 * lives here (DocsAssistant): Ask AI and its docs search on
 * /developers/docs, so a conversation survives moving between docs pages,
 * and Inkeep's chat and search on the other routes.
 */
export default async function DocsRootLayout({ children, params }: Props) {
  const { locale = "en" } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await loadMergedMessages({ app: "docs", locale });
  const landing = (messages.developers as AbstractIntlMessages)
    .landing as AbstractIntlMessages;
  const clientMessages: AbstractIntlMessages = {
    "cookie-consent": messages["cookie-consent"],
    commands: messages.commands,
    docsAsk: messages.docsAsk,
    askSolana: messages.askSolana,
    developers: {
      landing: { calc: landing.calc, newsletter: landing.newsletter },
    },
  };
  const googleTagManagerID = config.siteMetadata.googleTagManagerID;
  return (
    <html lang={locale} dir={getLangDir(locale)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleTagManagerNoScript containerId={googleTagManagerID} />
        <NextIntlClientProvider messages={clientMessages} locale={locale}>
          <GTMTrackingSnippet />
          <SitewideTopAlert />
          <CookieConsent />
          {/* Before the page: a panel left docked keeps its room from the
              first paint (on the docs only, see the script). */}
          <script
            // Static string, no user input.
            dangerouslySetInnerHTML={{ __html: DOCS_ASK_PREPAINT_SCRIPT }}
            suppressHydrationWarning
          />
          {children}
          <PersistentPodcastPlayer />
          <Script
            id="signals-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window === 'undefined') return;
                  if (typeof window.signals !== 'undefined') return;
                  var script = document.createElement('script');
                  script.src = 'https://cdn.cr-relay.com/v1/site/d7901f15-da9a-4a7a-bf5e-679354ce2f55/signals.js';
                  script.async = true;
                  window.signals = Object.assign(
                    [],
                    ['page', 'identify', 'form'].reduce(function (acc, method){
                      acc[method] = function () {
                        signals.push([method, arguments]);
                        return signals;
                      };
                    return acc;
                    }, {})
                  );
                  document.head.appendChild(script);
                })();
              `,
            }}
          />
          <DocsAssistant />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return staticLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getDocsBaseMetadata(locale);
}
