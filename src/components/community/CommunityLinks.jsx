import RoundedDepthCard from "../shared/RoundedDepthCard";
import { useTranslation } from "next-i18next";
import Button from "../shared/Button";

/**
 * @returns {JSX.Element}
 * @constructor
 */
const CommunityLinks = () => {
  const { t } = useTranslation();

  return (
    <section className="container mb-8">
      <div className="row pb-8">
        <div className="col-lg-6">
          <RoundedDepthCard
            className="h-100 p-5 d-flex flex-column justify-content-between"
            bgColor="#14f195"
            shadow="bottom"
          >
            <h2 className="h3 mb-8">{t("community.learn")}</h2>
            <Button to="/news" arrow noBorder>
              {t("community.blog")}
            </Button>
          </RoundedDepthCard>
        </div>
        <div className="col-lg-6 mt-5 mt-lg-0">
          <RoundedDepthCard
            className="h-100 p-5 d-flex flex-column justify-content-between"
            bgColor="#ab66ff"
            shadow="bottom"
          >
            <h2 className="h3 mb-8">{t("community.info")}</h2>
            <Button to="/validated" arrow noBorder>
              {t("community.podcast")}
            </Button>
          </RoundedDepthCard>
        </div>
      </div>
    </section>
  );
};

export default CommunityLinks;
