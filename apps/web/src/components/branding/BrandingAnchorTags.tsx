import { useTranslations } from "next-intl";

const BrandingAnchorTagsSection = () => {
  const t = useTranslations();

  return (
    <section>
      <p className="text-sm mp-4">{t("branding.tags.title")}</p>
      <div className="flex flex-col">
        <a href="#brand" className="text-[#f9f9fb]">
          <div className="flex items-center gap-x-3 py-3 border-b border-[#ffffff44] cursor-pointer text-lg">
            <span>{t("branding.tags.first-tag")}</span>
          </div>
        </a>
        <a href="#asset" className="text-[#f9f9fb]">
          <div className="flex items-center gap-x-3 py-3 border-b border-[#ffffff44] cursor-pointer text-lg">
            <span>{t("branding.tags.second-tag")}</span>
          </div>
        </a>
        <a href="#press" className="text-[#f9f9fb]">
          <div className="flex items-center gap-x-3 py-3 border-b border-[#ffffff44] cursor-pointer text-lg">
            <span>{t("branding.tags.third-tag")}</span>
          </div>
        </a>
      </div>
    </section>
  );
};

export default BrandingAnchorTagsSection;
