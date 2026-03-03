import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import clearspaceMain from "../../../public/src/img/branding/spacing.png";

const BrandingClearspace = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="h6 font-bold">{t("branding.clearspace.title")}</div>
      <p className="small mt-2">{t("branding.clearspace.description")}</p>
      <div className="flex items-center justify-center mt-12">
        <Image alt="" src={clearspaceMain} />
      </div>
    </section>
  );
};

export default BrandingClearspace;
