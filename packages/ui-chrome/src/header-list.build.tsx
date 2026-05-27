import { useTranslations } from "next-intl";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import {
  buildResourceItems,
  buildStartItems,
  buildUseCaseItems,
} from "./nav-section-content-config";

const HeaderListBuild = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[960px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-3">
      <div className="xl:w-[380px] xl:shrink-0 px-2 xl:px-3">
        <SectionHeading title={t("nav.build.start.title")} />
        <NavItemsList items={buildStartItems} />
      </div>
      <div className="px-2 xl:px-3 grow xl:min-w-0">
        <SectionHeading title={t("nav.build.resources.title")} />
        <NavItemsList items={buildResourceItems} />
      </div>
      <div className="px-2 xl:px-3 grow xl:min-w-0">
        <SectionHeading title={t("nav.build.useCases.title")} />
        <NavItemsList items={buildUseCaseItems} />
      </div>
    </div>
  );
};

export default HeaderListBuild;
