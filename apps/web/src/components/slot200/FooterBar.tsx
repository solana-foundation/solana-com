"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";

const DESIGNER_HREF = "https://x.com/BusinessMngr";

/** The claims-discipline footnote and design credit. */
export const FooterBar: React.FC = () => {
  const t = useTranslations("slot200.footer");
  return (
    <footer className="s2-footer">
      <p className="s2-footer-note">{t("claims")}</p>
      <p className="s2-footer-note">
        {t.rich("credit", {
          x: (chunks) => (
            <a href={DESIGNER_HREF} target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        })}
      </p>
    </footer>
  );
};
