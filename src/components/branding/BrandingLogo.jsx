import { useTranslation } from "next-i18next";
import BrandLogo from "../../../public/src/img/branding/brandLogo.inline.svg";

const BrandingLogo = () => {
  const { t } = useTranslation();

  return (
    <section id="brand">
      <h2 className="h3">{t("branding.logo.title")}</h2>
      <div className="h6 fw-bold mt-8">{t("branding.logo.sub-title")}</div>
      <div className="mt-5">
        <BrandLogo className="my-5" />
      </div>
      <p className="small mt-5">{t("branding.logo.description")}</p>
    </section>
  );
};

export default BrandingLogo;
