"use client";

import { useTranslations } from "next-intl";
import {
  HeaderDropdownLayout,
  NavDropdownColumn,
} from "./header-dropdown-layout";
import {
  NavGroup,
  NavColumns,
  NavItemsList,
  SectionHeading,
} from "./nav-section-renderers";
import {
  enterpriseBusinessColumns,
  enterpriseProofItems,
} from "./nav-section-content-config";

const HeaderListEnterprise = () => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.enterprise.business.title")} />
        <NavColumns columns={enterpriseBusinessColumns} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.enterprise.proof.title")}>
          <NavItemsList items={enterpriseProofItems} />
        </NavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListEnterprise;
