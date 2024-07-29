import styled from "styled-components";
import Image from "next/image";
import { ArrowRight } from "react-feather";

import { Trans, useTranslation } from "next-i18next";
import Button from "../shared/Button";
import CarouselCards from "../shared/CarouselCards";

import auditsImg from "../../../assets/ai/audits.png";
import auditsIcon from "../../../assets/ai/audits-icon.png";
import ecosystemImg from "../../../assets/ai/ecosystem.png";
import ecosystemIcon from "../../../assets/ai/ecosystem-icon.png";
import askSolanaImg from "../../../assets/ai/ask-solana.png";
import askSolanaIcon from "../../../assets/ai/ask-solana-icon.png";
import marginfiImg from "../../../assets/ai/marginfi.png";
import marginfiIcon from "../../../assets/ai/marginfi-icon.png";
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
  icon,
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
            {icon && (
              <Image className={styles["card__icon"]} src={icon} alt={title} />
            )}
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
            icon={auditsIcon}
            title="ai.build.card-1.title"
            subtitle="ai.build.card-1.subtitle"
            content="ai.build.card-1.content"
            ctaLink="https://twitter.com/ryan_trat/status/1645987870845566976?s=20"
          />
          <Card bgImage={auditsImg} />
          <Card
            color="#000"
            bgColor="#fff"
            dividerColor="#AC9EE3"
            icon={ecosystemIcon}
            title="ai.build.card-2.title"
            subtitle="ai.build.card-2.subtitle"
            content="ai.build.card-2.content"
            ctaLink="https://twitter.com/0xSamHogan/status/1649108585467740160"
          />
          <Card bgImage={ecosystemImg} />
          <Card
            bgColor="#752C8B"
            dividerColor="#FB8AF9"
            icon={askSolanaIcon}
            title="ai.build.card-3.title"
            subtitle="ai.build.card-3.subtitle"
            content="ai.build.card-3.content"
            ctaLink="https://twitter.com/ryan_trat/status/1635911140499943424?s=20"
          />
          <Card bgImage={askSolanaImg} />
          <Card
            bgColor="#43A0B6"
            dividerColor="#484DFF"
            icon={marginfiIcon}
            title="ai.build.card-4.title"
            subtitle="ai.build.card-4.subtitle"
            content="ai.build.card-4.content"
            ctaLink="https://twitter.com/marginfi/status/1648316203092574210?s=20"
          />
          <Card bgImage={marginfiImg} />
        </CarouselCards>
      </div>
    </section>
  );
}
