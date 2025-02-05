import styled from "styled-components";
import Image from "next/image";
import { ArrowRight } from "react-feather";

import { Trans, useTranslation } from "next-i18next";
import Button from "../shared/Button";
import CarouselCards from "../shared/CarouselCards";
import bgImage from "../../../assets/ai/build-bg.png";
import solanaAgentKitIcon from "../../../assets/ai/solana-agent-kit.png";
import elizaIcon from "../../../assets/ai/eliza.png";
import rigIcon from "../../../assets/ai/rig.png";
import goatIcon from "../../../assets/ai/goat.png";
import zerepyIcon from "../../../assets/ai/zerepy.jpg";

import styles from "./AiBuild.module.scss";

const StyledCard = styled.div`
  position: relative;
  color: ${(props) => (props.color ? props.color : "#fff")};
  background-color: ${(props) => props.bgColor ?? "unset"};
  background-size: cover;
  background-repeat: no-repeat;
`;

function Card({ color, bgColor, dividerColor, title, icon, content, ctaLink }) {
  const { t } = useTranslation();

  return (
    <StyledCard
      color={color}
      bgColor={bgColor}
      dividerColor={dividerColor}
      className={styles["card"]}
    >
      {title && (
        <>
          <div>
            <h3 className={styles["card__title"]}>{t(title)}</h3>
            <Image src={icon} alt="" className={styles["card__icon"]} />
            <span
              className={styles["card__divider"]}
              style={{ borderColor: dividerColor }}
            ></span>
            <p className={styles["card__content"]}>{t(content)}</p>
          </div>
          <div className={styles["card__cta"]}>
            <Button to={ctaLink} variant="captioned" noBorder newTab>
              <ArrowRight color={color} />
            </Button>
          </div>
        </>
      )}
    </StyledCard>
  );
}

export default function AiBuild() {
  return (
    <section className={styles["build"]}>
      <div className="container position-relative py-10">
        <Image className={styles["build__bg"]} src={bgImage} alt="" fill />
        <div className={styles["build__bg-effect"]}></div>
        <h2 className={styles["build__title"]}>
          <Trans
            i18nKey="ai.build.title"
            components={{
              colored: <span className={styles["build__title--colored"]} />,
            }}
          />
        </h2>
        <CarouselCards>
          <Card
            bgColor="#027DF2"
            title="ai.build.card-1.title"
            icon={solanaAgentKitIcon}
            content="ai.build.card-1.content"
            ctaLink="https://github.com/sendaifun/solana-agent-kit"
          />
          <Card
            bgColor="#387462"
            dividerColor="#00ffbd"
            title="ai.build.card-2.title"
            icon={elizaIcon}
            content="ai.build.card-2.content"
            ctaLink="https://github.com/elizaOS/eliza"
          />
          <Card
            bgColor="#752C8B"
            dividerColor="#FB8AF9"
            title="ai.build.card-3.title"
            icon={rigIcon}
            content="ai.build.card-3.content"
            ctaLink="https://docs.rig.rs/"
          />
          <Card
            bgColor="#43A0B6"
            dividerColor="#88e8ff"
            title="ai.build.card-4.title"
            icon={goatIcon}
            content="ai.build.card-4.content"
            ctaLink="https://github.com/goat-sdk/goat"
          />
          <Card
            bgColor="#6930c4"
            dividerColor="#b78bff"
            title="ai.build.card-5.title"
            icon={zerepyIcon}
            content="ai.build.card-5.content"
            ctaLink="https://www.zerepy.org/"
          />
        </CarouselCards>
      </div>
    </section>
  );
}
