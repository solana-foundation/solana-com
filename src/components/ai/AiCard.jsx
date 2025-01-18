import classNames from "classnames";
import Image from "next/legacy/image";
import { ArrowRight } from "react-feather";

// import { useTranslation } from "next-i18next";
import Button from "../shared/Button";
import RoundedDepthCard from "../shared/RoundedDepthCard";

import nftsEcosystemBlob from "../../../assets/ai/fund.png";

import styles from "./AiCard.module.scss";

export default function AiCard() {
  // const { t } = useTranslation();

  return (
    <section className="container my-12 py-md-10">
      <div className="position-relative d-flex d-md-block justify-content-center">
        <div className={styles["ai-card__graphic"]}>
          <Image src={nftsEcosystemBlob} placeholder="blur" alt="" />
        </div>
      </div>
      <RoundedDepthCard
        className={classNames(styles["card"], "px-8 pt-8 pb-5")}
      >
        <h3 className={classNames(styles["card__title"], "h2")}>
          Focus areas at the intersection of crypto and AI
        </h3>

        <div className={classNames(styles["card__content"], "my-5")}>
          <ul>
            <li>Facilitate the most vibrant agent-driven economy on Solana</li>
            <li>
              Make LLMs really good at writing Solana code and empowering Solana
              developers
            </li>
            <li>Support the open and decentralized AI stack</li>
          </ul>
        </div>

        <div className="d-flex flex-column">
          <Button
            to="https://x.com/knimkar/status/1863719025500623344"
            className="mt-6"
            noBorder={true}
            newTab
          >
            Read more on Solana x AI
            <ArrowRight className="ms-2" />
          </Button>
        </div>
      </RoundedDepthCard>
    </section>
  );
}
