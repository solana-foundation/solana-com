import Image from "next/image";
import { Button } from "@solana-foundation/solana-lib";
import { useTranslation } from "next-i18next";
import SolanaFootprintScale from "../../../assets/environment/comparative-scale-of-solana-footprint.png";

export default function EnvironmentEnergyUsage({ envData }) {
  const { t } = useTranslation();
  const solTransactionKJ = envData.solTransaction * 0.001;

  return (
    <section className="container my-8 py-8 my-lg-10 py-lg-10">
      <div className="row text-center mb-8">
        <div className="col-md-10 col-lg-8 mx-auto">
          <h2 className="h4">{t("environment.energy.title")}</h2>
          <p className="subdued">{t("environment.energy.subtitle")}</p>
        </div>
      </div>

      <div className="text-center">
        <p>
          {t("environment.energy.solanaTransaction")} [{solTransactionKJ}kJ]
        </p>
        <Image src={SolanaFootprintScale} alt="" className="img-fluid" />
      </div>

      <div className="text-center">
        <Button
          url="https://solana.com/news/announcing-real-time-emissions-measurement-on-the-solana-blockchain"
          hierarchy={"outline"}
          size={"lg"}
        >
          {t("environment.energy.cta")}
        </Button>
      </div>
    </section>
  );
}
