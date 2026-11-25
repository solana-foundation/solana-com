/**
 * Speculation Rules for /developers, so moving into the docs (same app, but
 * a full page load) is close to instant: any link on the page to the docs
 * or the cookbook (the header tabs, the hub's cards) is prerendered when the
 * reader hovers it or presses on it (`moderate`). Nothing is fetched before
 * that, so the page's own first load has the network to itself. Links with
 * a query (the search hand-off, /developers/docs?q=...) are skipped: the
 * docs would open the search dialog inside a page the reader may never see.
 * Paired with the cross-document view transition in docs-chrome.css and
 * content/styles/theme.css (section 18), the header stays put. Browsers
 * without Speculation Rules ignore the script type and navigate normally.
 * components/docs/docs-scripts.tsx does the reverse (docs logo -> /developers).
 */
export function getDeveloperSpeculationRules(locale: string) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return {
    prerender: [
      {
        source: "document",
        where: {
          and: [
            {
              or: [
                { href_matches: `${prefix}/developers/docs{/*}?` },
                { href_matches: `${prefix}/developers/cookbook{/*}?` },
              ],
            },
            { not: { selector_matches: "a[href*='?']" } },
          ],
        },
        eagerness: "moderate",
      },
    ],
  };
}

export function DeveloperSpeculationRules({ locale }: { locale: string }) {
  return (
    <script
      type="speculationrules"
      // Static JSON built from the locale, no user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getDeveloperSpeculationRules(locale)),
      }}
      suppressHydrationWarning
    />
  );
}
