"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";

const ANALYSIS_HREF = "/news/lowering-slot-time-and-validators-economic";
const UPGRADE_HREF = "/upgrades/reduced-slot-times";
const UPGRADES_HREF = "/upgrades";

/** Compact link bar plus the claims-discipline footnote. */
export const FooterBar: React.FC = () => {
  const t = useTranslations("slot200.footer");
  return (
    <footer className="s2-footer">
      <nav className="s2-footer-links" aria-label={t("navLabel")}>
        <a href={ANALYSIS_HREF}>{t("analysis")}</a>
        <a href={UPGRADE_HREF}>{t("upgrade")}</a>
        <a href={UPGRADES_HREF}>{t("allUpgrades")}</a>
      </nav>
      <p className="s2-footer-note">{t("claims")}</p>
    </footer>
  );
};
