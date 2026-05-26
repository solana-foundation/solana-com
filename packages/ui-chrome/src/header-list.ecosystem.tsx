"use client";

import { useTranslations } from "next-intl";
import {
  CollapsibleNavGroup,
  NavItemsList,
  NavSectionPromo,
} from "./nav-section-renderers";
import {
  ecosystemCategoryItems,
  ecosystemCommunityItems,
  ecosystemNetworkItems,
  navPromoConfigs,
} from "./nav-section-content-config";

const HeaderListEcosystem = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <div className="xl:w-[900px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 grow xl:w-[560px]">
        <CollapsibleNavGroup
          title={t("nav.ecosystem.network.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={ecosystemNetworkItems} />
        </CollapsibleNavGroup>
        <CollapsibleNavGroup
          className="mt-2"
          title={t("nav.ecosystem.community.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={ecosystemCommunityItems} />
        </CollapsibleNavGroup>
        <CollapsibleNavGroup
          className="mt-2"
          title={t("nav.ecosystem.categories.title")}
          isMobile={isMobile}
        >
          <NavItemsList items={ecosystemCategoryItems} />
        </CollapsibleNavGroup>
      </div>

      <NavSectionPromo promo={navPromoConfigs.ecosystem} />
    </div>
  );
};

export default HeaderListEcosystem;
