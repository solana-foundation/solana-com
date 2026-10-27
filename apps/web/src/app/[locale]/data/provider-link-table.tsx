"use client";

import { ArrowOutUpRightSquare as ExternalLink } from "@boxicons/react/ArrowOutUpRightSquare";
import { useTranslations } from "@workspace/i18n/client";
import type { DashboardTab } from "./data-config";
import { getProviderLinks } from "./provider-links";

/** One-row table linking to each provider's Solana data for the active tab. */
export function ProviderLinkTable({
  tab,
  tabLabel,
}: {
  tab: DashboardTab;
  tabLabel: string;
}) {
  const t = useTranslations("dataDashboard");
  const links = getProviderLinks(tab);

  if (links.length === 0) {
    return null;
  }

  return (
    // Scrolls sideways on narrow screens instead of widening the page.
    // `relative` keeps the absolutely positioned sr-only text inside it.
    <div className="relative mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <table className="border-collapse font-brand-mono text-[11px] leading-[1.42] font-bold uppercase">
        <caption className="sr-only">
          {t("providerLinks.caption", { tab: tabLabel })}
        </caption>
        <tbody>
          <tr>
            {links.map(({ href, name }) => (
              <td
                className="border border-nd-border-light p-0 whitespace-nowrap"
                key={name}
              >
                <a
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-nd-high-em-text transition-colors hover:bg-nd-border-light/20"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {name}
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  <span className="sr-only">
                    {t("providerLinks.opensInNewTab")}
                  </span>
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
