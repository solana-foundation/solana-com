import { useTranslations } from "next-intl";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import {
  networkInspectItems,
  networkResourceItems,
} from "./nav-section-content-config";

const HeaderListNetwork = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 xl:w-[390px]">
        <SectionHeading title={t("nav.network.resources.title")} />
        <NavItemsList items={networkResourceItems} />
      </div>
      <div className="px-3 grow">
        <SectionHeading title={t("nav.network.inspect.title")} />
        <NavItemsList items={networkInspectItems} />
      </div>
    </div>
  );
};

export default HeaderListNetwork;
