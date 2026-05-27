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
    <div className="xl:w-[960px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-3">
      <HeaderBanner
        className="xl:w-[300px] xl:shrink-0 w-full"
        title={t("nav.useSolana.banner.title")}
        description={t("nav.useSolana.banner.description")}
        cta={t("nav.useSolana.banner.cta")}
        ctaHref="/use-solana"
      />
      <div className="px-2 xl:px-3 grow xl:min-w-0">
        <SectionHeading title={t("nav.useSolana.wallets.title")} />
        <NavItemsList items={useSolanaWalletItems} />
        <CollapsibleNavGroup
          className="mt-2 xl:mt-4 xl:pt-2 xl:border-t xl:border-white/[0.06]"
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
