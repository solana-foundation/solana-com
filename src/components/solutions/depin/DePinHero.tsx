import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowRightIcon, ChevronRight } from "lucide-react";
import styles from "./DePINHero.module.scss";
import React from "react";
import { useTranslation } from "next-i18next";

type Stat = { value: string; label: string };

const useHeroStats = (t: ReturnType<typeof useTranslation>["t"]): Stat[] => [
  {
    value: t("depin.hero.stats.0.value"),
    label: t("depin.hero.stats.0.label"),
  },
  {
    value: t("depin.hero.stats.1.value"),
    label: t("depin.hero.stats.1.label"),
  },
  {
    value: t("depin.hero.stats.2.value"),
    label: t("depin.hero.stats.2.label"),
  },
];

const DePINHero = ({ onEmailClick }) => {
  const { t } = useTranslation("common");
  const stats = useHeroStats(t);

  const title = t("depin.hero.title");
  const firstDotIdx = title.indexOf(".");
  const beforeDot =
    firstDotIdx !== -1 ? title.slice(0, firstDotIdx + 1) : title;
  const afterDot = firstDotIdx !== -1 ? title.slice(firstDotIdx + 1) : "";

  return (
    <>
      <section
        id="depin-hero"
        className={styles.depinHero}
        aria-labelledby="depin-hero-title"
      >
        <div className={styles.badge}>
          <span className={styles.eyebrowText}>{t("depin.hero.badge")}</span>
          <ChevronRight className={styles.badgeIcon} size={14} />
        </div>

        <div className={styles.content}>
          <h1 id="depin-hero-title">
            {beforeDot}
            {afterDot && <br />}
            {afterDot}
          </h1>
          <p>{t("depin.hero.subtitle")}</p>

          <div className={styles.vectorDivider} aria-hidden="true" />
        </div>

        <p className={styles.reportEyebrow}>{t("depin.hero.reportEyebrow")}</p>

        <div className={styles.inputWrapper}>
          <Button
            variant="hero"
            size="lg"
            className={styles.emailButton}
            aria-label={t("depin.hero.emailCta")}
            onClick={onEmailClick}
          >
            {t("depin.hero.emailCta")} <ArrowRightIcon aria-hidden="true" />
          </Button>
        </div>

        <dl className={styles.statsBar}>
          {stats.map((s, idx) => (
            <React.Fragment key={s.label}>
              <div className={styles.statBlock}>
                <dt className="sr-only">{s.label}</dt>
                <dd className={styles.statValueGradient}>{s.value}</dd>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
              {idx < stats.length - 1 && <div className={styles.divider} />}
            </React.Fragment>
          ))}
        </dl>

        <Image
          src="/src/img/solutions/depin/globe.png"
          alt={t("depin.hero.globeAlt")}
          width={1400}
          height={800}
          className={styles.globe}
          priority={false}
          loading="lazy"
        />
      </section>
    </>
  );
};

export default DePINHero;
