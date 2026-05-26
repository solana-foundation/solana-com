"use client";

import { useTranslations } from "next-intl";
import { HeaderBanner } from "./header-banner";
import {
  NavItemsList,
  SectionHeading,
  CollapsibleNavGroup,
} from "./nav-section-renderers";
import {
  useSolanaSafetyItems,
  useSolanaWalletItems,
} from "./nav-section-content-config";

const HeaderListUseSolana = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <div className="xl:w-[840px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <HeaderBanner
        className="w-[400px] max-w-full"
        title={t("nav.useSolana.banner.title")}
        description={t("nav.useSolana.banner.description")}
        cta={t("nav.useSolana.banner.cta")}
        ctaHref="/use-solana"
      />
      <div className="px-3 grow">
        <SectionHeading title={t("nav.useSolana.wallets.title")} />
        <NavItemsList items={useSolanaWalletItems} />
        <CollapsibleNavGroup
          className="mt-2"
          title={t("nav.useSolana.safety.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={useSolanaSafetyItems} />
        </CollapsibleNavGroup>
      </div>
    </div>
  );
};

export default HeaderListUseSolana;
