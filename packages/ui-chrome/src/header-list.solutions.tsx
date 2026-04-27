"use client";

import { useTranslations } from "next-intl";
import {
  CollapsibleNavGroup,
  NavColumns,
  NavItemsList,
} from "./nav-section-renderers";
import {
  solutionsCasesColumns,
  solutionsResourceItems,
  solutionsToolsColumns,
} from "./nav-section-content-config";

const HeaderListSolutions = ({ isMobile = false }) => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:gap-2">
      <div className="px-3 max-xl:border-b max-xl:border-[rgba(238,228,255,0.04)] max-xl:border-dotted">
        <CollapsibleNavGroup
          title={t("nav.solutions.tools.title")}
          isMobile={isMobile}
        >
          <NavColumns columns={solutionsToolsColumns} />
        </CollapsibleNavGroup>
      </div>
      <div className="flex flex-col xl:flex-row">
        <div className="px-3 w-full xl:w-2/3 max-xl:border-b max-xl:border-[rgba(238,228,255,0.04)] max-xl:border-dotted">
          <CollapsibleNavGroup
            title={t("nav.solutions.cases.title")}
            isMobile={isMobile}
          >
            <NavColumns columns={solutionsCasesColumns} />
          </CollapsibleNavGroup>
        </div>
        <div className="px-3 w-full xl:w-1/3">
          <CollapsibleNavGroup
            title={t("nav.solutions.resources.title")}
            isMobile={isMobile}
          >
            <NavItemsList items={solutionsResourceItems} />
          </CollapsibleNavGroup>
        </div>
      </div>
    </div>
  );
};

export default HeaderListSolutions;
