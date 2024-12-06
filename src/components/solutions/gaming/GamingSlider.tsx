"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./GamingSlider.module.scss";
import CaretIcon from "@/components/icons/Caret";

const GamingSlider = () => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{
    title: string;
    content: string;
    img: string;
    url: string;
    boxShadow: string;
  } | null>(null);

  const handleMouseEnter = (card: {
    title: string;
    content: string;
    img: string;
    url: string;
    boxShadow: string;
  }) => {
    console.log("Hovering over card:", card);
    setTooltip(card);
  };

  const handleMouseLeave = () => {
    console.log("Mouse left card");
    setTooltip(null);
  };

  const cards = [
    {
      title: t("solutions-gaming.cards.star-atlas.title"),
      content: t("solutions-gaming.cards.star-atlas.content"),
      img: "/solutions/gaming/slider/row1-card1.jpg",
      url: "https://play.staratlas.com/",
      boxShadow: "#3079A6B2",
    },
    {
      title: t("solutions-gaming.cards.aurory.title"),
      content: t("solutions-gaming.cards.aurory.content"),
      img: "/solutions/gaming/slider/row1-card2.jpg",
      url: "https://aurory.io/",
      boxShadow: "#AE7272B2",
    },
    {
      title: t("solutions-gaming.cards.stepn-go.title"),
      content: t("solutions-gaming.cards.stepn-go.content"),
      img: "/solutions/gaming/slider/row1-card3.jpg",
      url: "https://stepngo.com/",
      boxShadow: "#7E5CDCB2",
    },
    {
      title: t("solutions-gaming.cards.br1.title"),
      content: t("solutions-gaming.cards.br1.content"),
      img: "/solutions/gaming/slider/row1-card4.jpg",
      url: "https://www.br1game.com/",
      boxShadow: "#22ABC1B2",
    },
    {
      title: t("solutions-gaming.cards.nyan-heros.title"),
      content: t("solutions-gaming.cards.nyan-heros.content"),
      img: "/solutions/gaming/slider/row1-card5.jpg",
      url: "https://nyanheroes.com/",
      boxShadow: "#3079A6B2",
    },
    {
      title: t("solutions-gaming.cards.photo-finish-live.title"),
      content: t("solutions-gaming.cards.photo-finish-live.content"),
      img: "/solutions/gaming/slider/row2-card1.jpg",
      url: "https://photofinish.live/",
      boxShadow: "#206E72B2",
    },
    {
      title: t("solutions-gaming.cards.genopets.title"),
      content: t("solutions-gaming.cards.genopets.content"),
      img: "/solutions/gaming/slider/row2-card2.jpg",
      url: "https://www.genopets.me/",
      boxShadow: "#A1937DB2",
    },
    {
      title: t("solutions-gaming.cards.portals.title"),
      content: t("solutions-gaming.cards.portals.content"),
      img: "/solutions/gaming/slider/row2-card3.jpg",
      url: "https://theportal.to/",
      boxShadow: "#29729FB2",
    },
    {
      title: t("solutions-gaming.cards.low-life-forms.title"),
      content: t("solutions-gaming.cards.low-life-forms.content"),
      img: "/solutions/gaming/slider/row2-card4.jpg",
      url: "https://www.rtrigger.com/#lowlifeforms",
      boxShadow: "#9F51EBB2",
    },
    {
      title: t("solutions-gaming.cards.mixmob.title"),
      content: t("solutions-gaming.cards.mixmob.content"),
      img: "/solutions/gaming/slider/row2-card5.jpg",
      url: "https://uprising.mixmob.io/",
      boxShadow: "#2D42C3B2",
    },
  ];

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "140px",
    arrows: true,
    slidesToShow: 3,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          centerPadding: "48px",
        },
      },
      {
        breakpoint: 639,
        settings: {
          slidesToShow: 1,
          centerPadding: "56px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "32px",
        },
      },
    ],
  };

  return (
    <div className={styles.Container}>
      <Slider {...settings} className={styles.Slider}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={styles.Card}
            onMouseEnter={() => handleMouseEnter(card)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={card.url}
              target="_blank"
              className={styles.CardInner}
              style={{ boxShadow: `0 0 24px 0 ${card.boxShadow}` }}
            >
              <div className={styles.CardImageWrapper}>
                <Image src={card.img} alt={card.title} fill />
              </div>
              <div className={styles.CardContent}>
                <h5>
                  <span>{card.title}</span>
                  <CaretIcon />
                </h5>
                <p>{card.content}</p>
              </div>
            </Link>

            {tooltip && tooltip.title === card.title && (
              <Link
                href={tooltip.url}
                target="_blank"
                className={styles.Tooltip}
                style={{ boxShadow: `0 0 24px 0 ${tooltip.boxShadow}` }}
              >
                <div className={styles.CardImageWrapper}>
                  <Image src={tooltip.img} alt={tooltip.title} fill />
                </div>
                <div className={styles.TooltipCardContent}>
                  <h5>
                    <span>{tooltip.title}</span>
                    <CaretIcon />
                  </h5>
                  <p>{tooltip.content}</p>
                </div>
              </Link>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GamingSlider;
