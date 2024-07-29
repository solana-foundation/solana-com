import { Trans, useTranslation } from "next-i18next";
import { InlineLink } from "../shared/Link";

const BrandingWelcome = () => {
  const { t } = useTranslation();

  return (
    <section>
      <div className="h6">{t("branding.welcome.title")}</div>
      <p className="small">{t("branding.welcome.description")}</p>
      <p className="small">
        <Trans
          i18nKey="branding.welcome.description-2"
          components={{
            guidelinesLink: (
              <InlineLink to="https://drive.google.com/file/d/1o8fsSbD6wtRWizBW_3OrNYFtF9ZTr7iQ/view" />
            ),
          }}
        />
      </p>
    </section>
  );
};

export default BrandingWelcome;
