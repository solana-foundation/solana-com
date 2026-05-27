"use client";

import { useTranslations } from "next-intl";
import {
  CollapsibleNavGroup,
  NavColumns,
  NavItemsList,
} from "./nav-section-renderers";
import {
  enterpriseBusinessColumns,
  enterpriseProofItems,
} from "./nav-section-content-config";

const HeaderListEnterprise = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <div className="xl:w-[960px] max-w-full flex flex-col xl:gap-3">
      <div className="px-2 xl:px-3 max-xl:border-b max-xl:border-[rgba(238,228,255,0.04)] max-xl:border-dotted">
        <CollapsibleNavGroup
          title={t("nav.enterprise.business.title")}
          isMobile={isMobile}
        >
          <NavColumns columns={enterpriseBusinessColumns} />
        </CollapsibleNavGroup>
      </div>
      <div className="px-2 xl:px-3 xl:pt-4 xl:mt-1 xl:border-t xl:border-white/[0.06]">
        <CollapsibleNavGroup
          title={t("nav.enterprise.proof.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={enterpriseProofItems} />
        </CollapsibleNavGroup>
      </div>
    </div>
  );
};

export default HeaderListEnterprise;
