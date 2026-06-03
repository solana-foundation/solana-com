"use client";

import { useTranslations } from "next-intl";
import {
  HeaderDropdownLayout,
  NavDropdownColumn,
} from "./header-dropdown-layout";
import {
  CollapsibleNavGroup,
  NavItemsList,
  SectionHeading,
} from "./nav-section-renderers";
import {
  ecosystemCategoryItems,
  ecosystemCommunityItems,
  ecosystemNetworkItems,
  navBannerConfigs,
} from "./nav-section-content-config";

const HeaderListEcosystem = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout banner={navBannerConfigs.ecosystem}>
      <NavDropdownColumn>
        <SectionHeading title={t("nav.ecosystem.network.title")} />
        <NavItemsList items={ecosystemNetworkItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.ecosystem.community.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={ecosystemCommunityItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.ecosystem.categories.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={ecosystemCategoryItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListEcosystem;
