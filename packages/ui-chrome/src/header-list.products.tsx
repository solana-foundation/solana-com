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
  productToolItems,
  productSurfaceItems,
} from "./nav-section-content-config";

const HeaderListProducts = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.products.surfaces.title")} />
        <NavItemsList items={productSurfaceItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <CollapsibleNavGroup
          title={t("nav.products.tools.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={productToolItems} />
        </CollapsibleNavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListProducts;
