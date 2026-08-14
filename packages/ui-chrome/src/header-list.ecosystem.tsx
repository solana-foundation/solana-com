"use client";

import { useTranslations } from "next-intl";
import {
  HeaderDropdownLayout,
  NavDropdownColumn,
} from "./header-dropdown-layout";
import {
  NavGroup,
  NavItemsList,
  SectionHeading,
} from "./nav-section-renderers";
import {
  ecosystemCategoryItems,
  ecosystemCommunityItems,
  ecosystemNetworkItems,
  navBannerConfigs,
} from "./nav-section-content-config";

const HeaderListEcosystem = () => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout banner={navBannerConfigs.ecosystem}>
      <NavDropdownColumn>
        <SectionHeading title={t("nav.ecosystem.network.title")} />
        <NavItemsList items={ecosystemNetworkItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.ecosystem.community.title")}>
          <NavItemsList items={ecosystemCommunityItems} />
        </NavGroup>
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.ecosystem.categories.title")}>
          <NavItemsList items={ecosystemCategoryItems} />
        </NavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListEcosystem;
