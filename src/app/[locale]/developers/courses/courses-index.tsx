"use client";
import SharedButton from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";

import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

import { CardDeck } from "@solana-foundation/solana-lib";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import HeroImage from "@@/public/src/img/validators/validators_geometry.png";
import YouTubeIcon from "@@/assets/developers/content/youtube.inline.svg";

export default function CoursesIndex({ courseCards }) {
  const { t } = useTranslation("common");

  return (
    <div className="overflow-hidden">
      <DevelopersHeroSection
        title={t("developers.courses.featured-item.title")}
        description={t("developers.courses.featured-item.description")}
        img={{
          src: HeroImage,
          // alt: "",
        }}
        buttons={{
          cta: {
            label: t("developers.course-hero.start-now"),
            href: "/developers/courses/intro-to-solana/getting-started",
          },
          secondary: {
            label: t("nav.developers.tutorials.bootcamp"),
            href: "https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc",
            icon: <YouTubeIcon width={16} height={20} fill="currentColor" />,
          },
        }}
      />
      <CardDeck numCols={3} cards={courseCards} isListing />
      <div className="container">
        <div className={classNames(styles["developers-content-page"])}>
          {/* @ts-expect-error */}
          <RoundedDepthCard
            className="p-5 mt-10"
            bgColor="#26262b"
            color="#ffffff"
            shadow="bottom"
          >
            <h4>{t("developers.resources.items.stackexchange.ask.title")}</h4>
            <p>
              {t("developers.resources.items.stackexchange.ask.description")}
            </p>
            {/* @ts-expect-error */}
            <SharedButton
              to="https://solana.stackexchange.com/"
              variant="secondary"
              newTab
            >
              {t("developers.resources.items.stackexchange.ask.cta-label")}
            </SharedButton>
          </RoundedDepthCard>
        </div>
      </div>
    </div>
  );
}
