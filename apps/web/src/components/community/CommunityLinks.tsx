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
      <div className="flex flex-col gap-6 rounded-2xl border border-white/15 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="h3">{t("community.superteam.title")}</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            {t("community.superteam.description")}
          </p>
        </div>
        <Button to="https://superteam.fun/" arrow noBorder newTab>
          {t("community.superteam.cta")}
        </Button>
      </div>
    </section>
  );
};

export default CommunityLinks;
