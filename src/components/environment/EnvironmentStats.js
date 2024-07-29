import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Slider from "react-slick";
import styled from "styled-components";
import { Button } from "@solana-foundation/solana-lib";
import styles from "./EnvironmentStats.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedNumber } from "../SolFormattedMessage";

const StyledSlider = styled(Slider)`
  top: -50px;

  .slick-dots {
    bottom: -30px !important;

    li {
      display: flex !important;
      justify-content: center;
      align-items: center;
    }
  }

  .slick-dots .dot {
    width: 8px;
    height: 8px;
    background-color: #fff;
    opacity: 0.2;
    border-radius: 8px;
  }

  .slick-dots .slick-active .dot {
    opacity: 1;
  }

  @media (min-width: 992px) {
    top: 0;
    height: 220px;
    background-color: rgba(12, 13, 15, 0.7);
    backdrop-filter: blur(7px);
    border-radius: 24px;

    .slick-list {
      width: 100%;
    }

    .slick-slide {
      border-right: 2px solid rgba(255, 255, 255, 0.1);
    }

    .slick-slide:last-of-type {
      border-right: none;
    }
  }
`;

function StatItem({ value, title }) {
  const { t } = useTranslation("common");

  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center",
        styles["environment-stats__item"],
      )}
    >
      <div className="col-12">
        <h3>
          <FormattedNumber value={value} />
        </h3>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <span className="subdued">{t(title)}</span>
      </div>
    </div>
  );
}

export default function EnvironmentStats({ envData }) {
  const { t } = useTranslation("common");

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: false,
    arrows: false,
    className: "d-flex justify-content-center align-items-center",
    dotsClass: "slick-dots d-flex justify-content-center align-items-center",
    customPaging: () => {
      return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <div className="dot"></div>
        </div>
      );
    },
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className={classNames("container", styles["environment-stats"])}>
      <div title="June 1st, 2022 - May 31st, 2023">
        <StyledSlider {...settings}>
          <StatItem
            value={envData.solTransaction}
            title={"environment.stats.transaction"}
          />
          <StatItem
            value={envData.solNonVotingTransaction}
            title={"environment.stats.nonvoting-transaction"}
          />
          <StatItem
            value={envData.annualCarbonFootprint}
            title={"environment.stats.annual-carbon-footprint"}
          />
          <StatItem value={"0"} title={"environment.stats.net-carbon-impact"} />
        </StyledSlider>
      </div>

      <div className="text-center mt-8">
        <Button
          url={"https://solanaclimate.com/"}
          hierarchy={"outline"}
          endIcon={"arrow-up-right"}
          size={"lg"}
          iconSize={"md"}
        >
          {t("environment.cta-data")}
        </Button>
      </div>
    </section>
  );
}
