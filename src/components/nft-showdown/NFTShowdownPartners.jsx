import { useTranslation } from "next-i18next";
import styles from "./NFTShowdownPartners.module.scss";
import Image from "next/image";

import Dialect from "../../../assets/nft-showdown/partners/dialect.png";
import Tensor from "../../../assets/nft-showdown/partners/tensor.png";
import Claynosaurz from "../../../assets/nft-showdown/partners/claynosaurz.png";
import Boots from "../../../assets/nft-showdown/partners/boots.png";

import Daa from "../../../assets/nft-showdown/partners/daa.png";
import Okb from "../../../assets/nft-showdown/partners/okb.png";
import Backpack from "../../../assets/nft-showdown/partners/backpack.png";
import Me from "../../../assets/nft-showdown/partners/me.png";
import Frictionlesscapital from "../../../assets/nft-showdown/partners/fc.png";

import Hyperspace from "../../../assets/nft-showdown/partners/hyperspace.png";
import Monkedao from "../../../assets/nft-showdown/partners/monkedao.png";
import Metaplex from "../../../assets/nft-showdown/partners/metaplex.png";
import Lollipop from "../../../assets/nft-showdown/partners/lollipop.png";

const NFTShowdownPartners = () => {
  const { t } = useTranslation("common");

  return (
    <div className="my-10">
      <div className={styles["nft-showdown-partners"]}>
        <h2 className="mono section-title h6 fw-normal mb-5">
          {t("nft-showdown.partners.title")}:
        </h2>

        <div className={styles["nft-showdown-partners__logos"]}>
          <Image src={Dialect} alt="Dialect" />
          <Image src={Tensor} alt="Tensor" />
          <Image src={Claynosaurz} alt="Claynosaurz" />
          <Image src={Boots} alt="Boots" />
          <div className={styles["nft-showdown-partners__logos__break"]}></div>
          <Image src={Daa} alt="Daa" />
          <Image src={Okb} alt="Okay Bears" />
          <Image src={Backpack} alt="Backpack" />
          <Image src={Me} alt="Magic Eden" />
          <Image src={Frictionlesscapital} alt="Frictionless Capital" />
          <div className={styles["nft-showdown-partners__logos__break"]}></div>
          <Image src={Hyperspace} alt="Hyperspace" />
          <Image src={Monkedao} alt="MonkeDao" />
          <Image src={Metaplex} alt="Metaplex" />
          <Image src={Lollipop} alt="Lollipop" />
        </div>
      </div>
    </div>
  );
};

export default NFTShowdownPartners;
