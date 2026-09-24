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
  buildResourceItems,
  buildStartItems,
  buildUseCaseItems,
} from "./nav-section-content-config";

const HeaderListBuild = () => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.build.start.title")} />
        <NavItemsList items={buildStartItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.build.resources.title")}>
          <NavItemsList items={buildResourceItems} />
        </NavGroup>
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.build.useCases.title")}>
          <NavItemsList items={buildUseCaseItems} />
        </NavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListBuild;
