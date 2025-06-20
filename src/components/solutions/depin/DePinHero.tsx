import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Text from "@/components/shared/Text";
import { Button } from "@/app/components/ui/button";
import { ChevronRight } from "lucide-react";
import styles from "./DePINHero.module.scss";
import React from "react";
import type { StaticImageData } from "next/image";
import { useTranslation } from "next-i18next";

// Import images
import globeImage from "assets/solutions/depin/globe.png";
import heliumLogo from "assets/solutions/depin/helium.png";
import renderLogo from "assets/solutions/depin/render.png";
import hivemapperLogo from "assets/solutions/depin/hivemapper.png";
import starpowerLogo from "assets/solutions/depin/starpower.png";
import geodnetLogo from "assets/solutions/depin/geodnet.png";
import skytradeLogo from "assets/solutions/depin/skytrade.png";
import xnetLogo from "assets/solutions/depin/xnet.png";
import cudisLogo from "assets/solutions/depin/cudis.png";
import natixLogo from "assets/solutions/depin/natix.png";

// Base (static) logo list to avoid repeating StaticImageData imports in JSON
const projectLogos: StaticImageData[] = [
  heliumLogo,
  hivemapperLogo,
  renderLogo,
  starpowerLogo,
  geodnetLogo,
  skytradeLogo,
  xnetLogo,
  cudisLogo,
  natixLogo,
];

type ProjectStats = {
  users: string;
  label: string;
};

type Project = {
  logo: StaticImageData;
  name: string;
  description: string;
  stats: ProjectStats;
};

type ProjectCardProps = {
  data: Project;
};

const ProjectCard = React.memo(({ data }: ProjectCardProps) => (
  <motion.div className={styles.cardWrapper}>
    <div className={styles.projectCard}>
      <div className={styles.cardHeader}>
        <Image
          src={data.logo}
          alt={data.name}
          width={32}
          height={32}
          className={styles.logo}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <h3>{data.name}</h3>
        <div className={styles.arrow}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 15L15 5M15 5H5M15 5V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.singleStat}>
        <span className={styles.statValue}>{data.stats.users}</span>
        <span className={styles.statLabel}>{data.stats.label}</span>
      </div>
    </div>
  </motion.div>
));

const DePINHero = () => {
  const { t } = useTranslation("common");

  // Build slider data from i18n keys so that copy is translatable
  const sliderData: Project[] = projectLogos.map((logo, idx) => ({
    logo,
    name: t(`depin.hero.slider.${idx}.name`),
    description: t(`depin.hero.slider.${idx}.description`),
    stats: {
      users: t(`depin.hero.slider.${idx}.stats.users`),
      label: t(`depin.hero.slider.${idx}.stats.label`),
    },
  }));

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Automatic scrolling
  const autoScroll = useCallback(() => {
    if (!carouselRef.current || !isAutoScrolling) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    if (scrollLeft >= scrollWidth - clientWidth - 10) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: 424, behavior: "smooth" });
    }
  }, [isAutoScrolling]);

  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollTimerRef.current = setInterval(autoScroll, 5000);
    }
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScrolling, autoScroll]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      setIsAutoScrolling(false);
      carouselRef.current.scrollBy({ left: -424, behavior: "smooth" });
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      setIsAutoScrolling(false);
      carouselRef.current.scrollBy({ left: 424, behavior: "smooth" });
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  return (
    <section className={styles.hero}>
      {/* DePIN Badge */}
      <div className={styles.badge}>
        <span className={styles.eyebrowText}>{t("depin.hero.badge")}</span>
        <ChevronRight className={styles.badgeIcon} size={14} />
      </div>

      <div className={styles.content}>
        <Text element="h1" as="heading">
          {t("depin.hero.title")}
        </Text>
        <Text element="p" as="paragraph">
          {t("depin.hero.subtitle")}
        </Text>
        <Button
          variant="hero"
          size="lg"
          onClick={() => (window.location.href = "#depin-resources")}
        >
          {t("depin.hero.cta")}
        </Button>
      </div>

      <div className={styles.sliderSection}>
        <button
          className={`${styles.navigationButton} ${styles.prev}`}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label={t("depin.hero.prevAria")}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M23 28L15 20L23 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={styles.carouselContainer}
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={styles.cards}>
            {sliderData.map((project, index) => (
              <ProjectCard key={index} data={project} />
            ))}
          </div>
        </div>

        <button
          className={`${styles.navigationButton} ${styles.next}`}
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label={t("depin.hero.nextAria")}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M17 28L25 20L17 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <Image
        src={globeImage}
        alt={t("depin.hero.globeAlt")}
        width={1400}
        height={800}
        className={styles.globe}
        priority={false}
        loading="lazy"
      />
    </section>
  );
};

export default DePINHero;
