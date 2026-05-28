"use client";

import { useTranslations } from "next-intl";
import {
  HeaderDropdownLayout,
  NavDropdownColumn,
} from "./header-dropdown-layout";
import {
  NavItemsList,
  SectionHeading,
  CollapsibleNavGroup,
} from "./nav-section-renderers";
import {
  navBannerConfigs,
  useSolanaSafetyItems,
  useSolanaWalletItems,
} from "./nav-section-content-config";

const HeaderListUseSolana = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout banner={navBannerConfigs.use_solana}>
      <NavDropdownColumn width="grow">
        <SectionHeading title={t("nav.useSolana.wallets.title")} />
        <NavItemsList items={useSolanaWalletItems} />
        <CollapsibleNavGroup
          className="mt-2 xl:mt-4 xl:pt-2 xl:border-t xl:border-white/[0.06]"
          title={t("nav.useSolana.safety.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={useSolanaSafetyItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListUseSolana;
