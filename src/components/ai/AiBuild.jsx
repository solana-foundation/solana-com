import styled from "styled-components";
import Image from "next/image";
import { ArrowRight } from "react-feather";

import { Trans, useTranslation } from "next-i18next";
import Button from "../shared/Button";
import CarouselCards from "../shared/CarouselCards";
import bgImage from "../../../assets/ai/build-bg.png";

import styles from "./AiBuild.module.scss";

const StyledCard = styled.div`
  position: relative;
  color: ${(props) => (props.color ? props.color : "#fff")};
  background-color: ${(props) => props.bgColor ?? "unset"};
  background-image: url("${(props) => (props.$image ? props.$image.src : "")}");
  background-size: cover;
  background-repeat: no-repeat;
`;

function Card({
  color,
  bgColor,
  bgImage,
  dividerColor,
  title,
  subtitle,
  content,
  ctaLink,
}) {
  const { t } = useTranslation();

  return (
    <StyledCard
      color={color}
      bgColor={bgColor}
      dividerColor={dividerColor}
      $image={bgImage}
      className={styles["card"]}
    >
      {title && (
        <>
          <div>
            <h3 className={styles["card__title"]}>{t(title)}</h3>
            <p className={styles["card__subtitle"]}>{t(subtitle)}</p>
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
            content="ai.build.card-1.content"
            ctaLink="https://github.com/sendaifun/solana-agent-kit"
          />
          <Card
            color="#000"
            bgColor="#fff"
            dividerColor="#AC9EE3"
            title="ai.build.card-2.title"
            content="ai.build.card-2.content"
            ctaLink="https://github.com/elizaOS/eliza"
          />
          <Card
            bgColor="#752C8B"
            dividerColor="#FB8AF9"
            title="ai.build.card-3.title"
            content="ai.build.card-3.content"
            ctaLink="https://github.com/goat-sdk/goat"
          />
          <Card
            bgColor="#43A0B6"
            dividerColor="#88e8ff"
            title="ai.build.card-4.title"
            content="ai.build.card-4.content"
            ctaLink="https://x.com/askthehive_ai/status/1879673480133931379"
          />
          <Card
            bgColor="#008565"
            dividerColor="#4fffd5"
            title="ai.build.card-5.title"
            content="ai.build.card-5.content"
            ctaLink="https://github.com/piotrostr/listen"
          />
        </CarouselCards>
      </div>
    </section>
  );
}
