import { useTranslations } from "next-intl";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import {
  buildPrimaryItems,
  buildTutorialItems,
} from "./nav-section-content-config";

const HeaderListBuild = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="xl:w-[480px] px-3">
        <SectionHeading title={t("nav.developers.items.title")} />
        <NavItemsList items={buildPrimaryItems} />
      </div>
      <div className="px-3 grow">
        <SectionHeading title={t("nav.developers.tutorials.title")} />
        <NavItemsList items={buildTutorialItems} />
      </div>
    </div>
  );
};

export default HeaderListBuild;
