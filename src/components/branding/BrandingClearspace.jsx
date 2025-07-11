import Image from "next/legacy/image";
import { useTranslations } from "next-intl";
import clearspaceMain from "../../../public/src/img/branding/spacing.png";

const BrandingClearspace = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="h6 fw-bold">{t("branding.clearspace.title")}</div>
      <p className="small mt-2">{t("branding.clearspace.description")}</p>
      <div className="d-flex align-items-center justify-content-center mt-8">
        <Image alt="" src={clearspaceMain} />
      </div>
    </section>
  );
};

export default BrandingClearspace;
