import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import PossibleEcosystemData from "./PossibleEcosystemData";
import PossibleGlow from "./PossibleGlow";
import PossibleEcosystemGrid from "./PossibleEcosystemGrid";

const PossibleEcosystem = () => {
  const { t } = useTranslation();

  return (
    <section className={`pt-10 pb-8 pt-md-12 pb-md-10 position-relative`}>
      <PossibleGlow
        backgroundColor="#9e00d6"
        top="0%"
        left="65%"
        height="520px"
        width="900px"
        rotation="20deg"
      />
      <PossibleGlow
        backgroundColor="#2e00e6"
        top="20%"
        left="30%"
        height="520px"
        width="900px"
        rotation="20deg"
      />
      <div className="container position-relative">
        <div className={`row`}>
          <div className="col d-flex flex-row mb-8 mb-md-0 pb-md-10 align-items-center ">
            <h2 className="h2 pe-5 flex-grow-1 flex-shrink-1 mb-0">
              {t("possible.ecosystem.title")}
            </h2>
            <Button
              to="/news"
              newTab
              variant="outline"
              size="medium"
              className="d-none d-md-block mb-2 align-self-end flex-shrink-0 flex-grow-0"
            >
              {t("possible.ecosystem.cta")}
            </Button>
          </div>
        </div>
      </div>
      <div className="container-fluid p-0 mb-6 mb-md-0">
        <div className={`row`}>
          <PossibleEcosystemGrid data={PossibleEcosystemData} />
        </div>
      </div>
      <div className="container d-block d-md-none">
        <div className={`row`}>
          <div className={`col text-center`}>
            <Button
              to="/news"
              newTab
              variant="outline"
              size="medium"
              className="mt-4 align-self-end flex-shrink-0 flex-grow-0"
            >
              {t("possible.ecosystem.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PossibleEcosystem;
