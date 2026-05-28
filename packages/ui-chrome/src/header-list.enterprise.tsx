"use client";

import { useTranslations } from "next-intl";
import {
  HeaderDropdownLayout,
  NavDropdownColumn,
} from "./header-dropdown-layout";
import {
  CollapsibleNavGroup,
  NavColumns,
  NavItemsList,
  SectionHeading,
} from "./nav-section-renderers";
import {
  enterpriseBusinessColumns,
  enterpriseProofItems,
} from "./nav-section-content-config";

const HeaderListEnterprise = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.enterprise.business.title")} />
        <NavColumns columns={enterpriseBusinessColumns} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.enterprise.proof.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={enterpriseProofItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListEnterprise;
