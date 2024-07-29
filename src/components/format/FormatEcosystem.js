import { useTranslation } from "next-i18next";
import RoundedDepthCard from "../shared/RoundedDepthCard";
import Button from "../shared/Button";

const FormatHero = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="container mt-10 pt-10">
        <h2 className="title mb-0">{t("format.ecosystem.title")}</h2>
        <p className="description">{t("format.ecosystem.description")}</p>
        <div className="row g-0">
          <div className="col-lg-4 my-2">
            <RoundedDepthCard shadow="bottom" className="p-6 h-100 m-1">
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <h3 className="h4">{t("format.ecosystem.nft.title")}</h3>
                  <p>{t("format.ecosystem.nft.description")}</p>
                </div>
                <Button to="/learn/nfts" noBorder>
                  {t("format.ecosystem.nft.cta")}
                </Button>
              </div>
            </RoundedDepthCard>
          </div>
          <div className="col-lg-4 my-2">
            <RoundedDepthCard
              shadow="bottom"
              className="p-6 h-100 m-1"
              bgColor="#fa428e"
            >
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <h3 className="h4">
                    {t("format.ecosystem.magiceden.title")}
                  </h3>
                  <p>{t("format.ecosystem.magiceden.description")}</p>
                </div>
                <Button to="https://magiceden.io/" noBorder newTab>
                  {t("format.ecosystem.magiceden.cta")}
                </Button>
              </div>
            </RoundedDepthCard>
          </div>
          <div className="col-lg-4 my-2">
            <RoundedDepthCard
              shadow="bottom"
              className="p-6 h-100 m-1"
              bgColor="#63c5ff"
            >
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <h3 className="h4">{t("format.ecosystem.tipLink.title")}</h3>
                  <p>{t("format.ecosystem.tipLink.description")}</p>
                </div>
                <Button to="https://tiplink.io/" noBorder newTab>
                  {t("format.ecosystem.tipLink.cta")}
                </Button>
              </div>
            </RoundedDepthCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormatHero;
