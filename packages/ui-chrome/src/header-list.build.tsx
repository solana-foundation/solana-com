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
    <div className="xl:w-[900px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="xl:w-[360px] px-3">
        <SectionHeading title={t("nav.build.start.title")} />
        <NavItemsList items={buildStartItems} />
      </div>
      <div className="px-3 grow">
        <SectionHeading title={t("nav.build.resources.title")} />
        <NavItemsList items={buildResourceItems} />
      </div>
      <div className="px-3 grow">
        <SectionHeading title={t("nav.build.useCases.title")} />
        <NavItemsList items={buildUseCaseItems} />
      </div>
    </div>
  );
};

export default HeaderListBuild;
