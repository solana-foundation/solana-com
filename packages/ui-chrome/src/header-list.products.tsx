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
  productToolItems,
  productSurfaceItems,
} from "./nav-section-content-config";

const HeaderListProducts = () => {
  const t = useTranslations();

  return (
    <HeaderDropdownLayout>
      <NavDropdownColumn width="primary">
        <SectionHeading title={t("nav.products.surfaces.title")} />
        <NavItemsList items={productSurfaceItems} />
      </NavDropdownColumn>
      <NavDropdownColumn>
        <NavGroup title={t("nav.products.tools.title")}>
          <NavItemsList items={productToolItems} />
        </NavGroup>
      </NavDropdownColumn>
    </HeaderDropdownLayout>
  );
};

export default HeaderListProducts;
