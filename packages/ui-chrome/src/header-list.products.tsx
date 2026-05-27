import { useTranslations } from "next-intl";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import {
  productToolItems,
  productSurfaceItems,
} from "./nav-section-content-config";

const HeaderListProducts = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[960px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-3">
      <div className="px-2 xl:px-3 xl:w-[560px] xl:shrink-0">
        <SectionHeading title={t("nav.products.surfaces.title")} />
        <NavItemsList items={productSurfaceItems} />
      </div>
      <div className="px-2 xl:px-3 grow xl:min-w-0 xl:border-l xl:border-white/[0.06] xl:pl-6">
        <SectionHeading title={t("nav.products.tools.title")} />
        <NavItemsList items={productToolItems} />
      </div>
    </div>
  );
};

export default HeaderListProducts;
