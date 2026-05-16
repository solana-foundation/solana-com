import { useTranslations } from "next-intl";
import Button from "../shared/Button";
import PossibleEcosystemData from "./PossibleEcosystemData";
import PossibleGlow from "./PossibleGlow";
import PossibleEcosystemGrid from "./PossibleEcosystemGrid";

const PossibleEcosystem = () => {
  const t = useTranslations();

  return (
    <section className="pt-20 pb-12 md:pt-32 md:pb-20 relative">
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
      <div className="container relative">
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 flex mb-12 md:mb-0 md:pb-20 items-center">
            <h2 className="h2 pr-6 grow shrink mb-0">
              {t("possible.ecosystem.title")}
            </h2>
            <Button
              to="/news"
              newTab
              variant="outline"
              size="medium"
              className="hidden md:block mb-2 self-end shrink-0 grow-0"
            >
              {t("possible.ecosystem.cta")}
            </Button>
          </div>
        </div>
      </div>
      <div className="container-fluid p-0 mb-8 md:mb-0">
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <PossibleEcosystemGrid data={PossibleEcosystemData} />
        </div>
      </div>
      <div className="container block md:hidden">
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 text-center">
            <Button
              to="/news"
              newTab
              variant="outline"
              size="medium"
              className="mt-4 self-end shrink-0 grow-0"
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
