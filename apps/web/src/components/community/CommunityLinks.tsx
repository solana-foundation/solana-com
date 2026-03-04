import RoundedDepthCard from "../shared/RoundedDepthCard";
import { useTranslations } from "next-intl";
import Button from "../shared/Button";

/**
 * @returns {JSX.Element}
 * @constructor
 */
const CommunityLinks = () => {
  const t = useTranslations();

  return (
    <section className="container mb-12">
      <div className="grid grid-cols-12 gap-5 md:gap-10 pb-12">
        <div className="col-span-12 lg:col-span-6">
          <RoundedDepthCard
            className="h-full p-6 flex flex-col justify-between"
            bgColor="#14f195"
            shadow="bottom"
          >
            <h2 className="h3 mb-12">{t("community.learn")}</h2>
            <Button to="/news" arrow noBorder>
              {t("community.blog")}
            </Button>
          </RoundedDepthCard>
        </div>
        <div className="col-span-12 lg:col-span-6 mt-6 lg:mt-0">
          <RoundedDepthCard
            className="h-full p-6 flex flex-col justify-between"
            bgColor="#ab66ff"
            shadow="bottom"
          >
            <h2 className="h3 mb-12">{t("community.info")}</h2>
            <Button to="/podcasts" arrow noBorder>
              {t("community.podcast")}
            </Button>
          </RoundedDepthCard>
        </div>
      </div>
    </section>
  );
};

export default CommunityLinks;
