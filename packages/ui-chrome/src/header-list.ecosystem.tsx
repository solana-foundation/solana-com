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
    <div className="xl:w-[960px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-4 xl:items-start">
      <div className="px-2 xl:px-3 grow xl:min-w-0 max-xl:space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-5">
        <div>
          <CollapsibleNavGroup
            title={t("nav.ecosystem.network.title")}
            isMobile={isMobile}
          >
            <NavItemsList items={ecosystemNetworkItems} />
          </CollapsibleNavGroup>
        </div>
        <div>
          <CollapsibleNavGroup
            title={t("nav.ecosystem.community.title")}
            isMobile={isMobile}
          >
            <NavItemsList items={ecosystemCommunityItems} />
          </CollapsibleNavGroup>
        </div>
        <div>
          <CollapsibleNavGroup
            title={t("nav.ecosystem.categories.title")}
            isMobile={isMobile}
          >
            <NavItemsList items={ecosystemCategoryItems} />
          </CollapsibleNavGroup>
        </div>
      </div>

      <NavSectionPromo promo={navPromoConfigs.ecosystem} />
    </div>
  );
};

export default HeaderListEcosystem;
