"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";

const ANALYSIS_HREF = "/news/lowering-slot-time-and-validators-economic";
const UPGRADE_HREF = "/upgrades/reduced-slot-times";
const UPGRADES_HREF = "/upgrades";

/** Three callout cards below the dash: analysis, rollout tracker, upgrades. */
export const ResourceLinks = React.memo(function ResourceLinks() {
  const t = useTranslations("slot200.footer");
  const cards = [
    { href: ANALYSIS_HREF, title: t("analysis"), desc: t("analysisDesc") },
    { href: UPGRADE_HREF, title: t("upgrade"), desc: t("upgradeDesc") },
    {
      href: UPGRADES_HREF,
      title: t("allUpgrades"),
      desc: t("allUpgradesDesc"),
    },
  ];
  return (
    <nav className="s2-resources" aria-label={t("navLabel")}>
      {cards.map((card) => (
        <a key={card.href} className="s2-rescard" href={card.href}>
          <span className="s2-rescard-t">
            {card.title}
            <span aria-hidden className="s2-rescard-arrow">
              ↗
            </span>
          </span>
          <span className="s2-rescard-d">{card.desc}</span>
        </a>
      ))}
    </nav>
  );
});
