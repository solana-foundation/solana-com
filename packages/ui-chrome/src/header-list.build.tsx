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
  buildResourceItems,
  buildStartItems,
  buildUseCaseItems,
} from "./nav-section-content-config";

const HeaderListBuild = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.build.start.title")} />
        <NavItemsList items={buildStartItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.build.resources.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={buildResourceItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.build.useCases.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={buildUseCaseItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListBuild;
