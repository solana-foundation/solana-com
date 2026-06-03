import { useTranslations } from "next-intl";
import BrandLogo from "../../../public/src/img/branding/brandLogo.inline.svg";

const BrandingLogo = () => {
  const t = useTranslations();

  return (
    <section id="brand">
      <h2 className="h3">{t("branding.logo.title")}</h2>
      <div className="h6 font-bold mt-12">{t("branding.logo.sub-title")}</div>
      <div className="mt-6">
        <BrandLogo className="my-6" />
      </div>
      <p className="small mt-6">{t("branding.logo.description")}</p>
    </section>
  );
};

export default BrandingLogo;
