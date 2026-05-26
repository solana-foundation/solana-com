import { useTranslations } from "next-intl";
import { NavItemsList, SectionHeading } from "./nav-section-renderers";
import {
  productAdjacentItems,
  productSurfaceItems,
} from "./nav-section-content-config";

const HeaderListProducts = () => {
  const t = useTranslations();

  return (
    <div className="xl:w-[800px] max-w-full flex flex-col xl:flex-row max-xl:gap-6 xl:gap-2">
      <div className="px-3 xl:w-[470px]">
        <SectionHeading title={t("nav.products.surfaces.title")} />
        <NavItemsList items={productSurfaceItems} />
      </div>
      <div className="px-3 grow">
        <SectionHeading title={t("nav.products.adjacent.title")} />
        <NavItemsList items={productAdjacentItems} />
      </div>
    </div>
  );
};

export default HeaderListProducts;
