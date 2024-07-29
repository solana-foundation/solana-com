import { useTranslation } from "next-i18next";

const BrandingPress = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-10" id="press">
      <h2 className="h3">{t("branding.press.title")}</h2>
      <p className="small">
        {t("branding.press.description")}{" "}
        <a href="mailto:press@solana.org" className="link">
          press@solana.org
        </a>
        .
      </p>
    </section>
  );
};

export default BrandingPress;
