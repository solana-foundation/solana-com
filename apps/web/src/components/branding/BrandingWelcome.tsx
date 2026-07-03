import { useTranslations } from "next-intl";
import { InlineLink } from "../../utils/Link";

const BrandingWelcome = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="h6">{t("branding.welcome.title")}</div>
      <p className="small">{t("branding.welcome.description")}</p>
      <p className="small">
        {t.rich("branding.welcome.description-2", {
          guidelinesLink: (chunks) => (
            <InlineLink to="https://docs.google.com/document/d/1gOjdCVI2tp-hpCJciSNZAR93cxgw_gh2/edit?usp=sharing&ouid=109711680778628598493&rtpof=true&sd=true">
              {chunks}
            </InlineLink>
          ),
        })}
      </p>
    </section>
  );
};

export default BrandingWelcome;
