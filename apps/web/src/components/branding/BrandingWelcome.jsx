import { useTranslations } from "next-intl";
import { InlineLink } from "../shared/Link";

const BrandingWelcome = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="h6">{t("branding.welcome.title")}</div>
      <p className="small">{t("branding.welcome.description")}</p>
      <p className="small">
        {t.rich("branding.welcome.description-2", {
          guidelinesLink: (chunks) => (
            <InlineLink to="https://drive.google.com/file/d/1o8fsSbD6wtRWizBW_3OrNYFtF9ZTr7iQ/view">
              {chunks}
            </InlineLink>
          ),
        })}
      </p>
    </section>
  );
};

export default BrandingWelcome;
