import { memo, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { Trans, useTranslation } from "next-i18next";
import styles from "./InstagramEnergyUsage.module.scss";
import InstagramEnergyUsageBar from "./InstagramEnergyUsageBar/InstagramEnergyUsageBar";
import NextIcon from "../../../../assets/instagram/energy-usage/next.inline.svg";
import PrevIcon from "../../../../assets/instagram/energy-usage/prev.inline.svg";
import Background from "../../../../assets/instagram/energy-usage/background.svg";
import Image from "next/legacy/image";
import Link from "../../../utils/Link";

export default memo(function InstagramEnergyUsage() {
  const { t } = useTranslation("common");

  const SOLANA_STATISTIC = useRef({
    label: t("energy-usage.stats.solana-transaction.label"),
    statistic: t("energy-usage.stats.solana-transaction.stat"),
    color: "#14f195",
    // @NOTE - this is a bit of a hack as calculating the percentage returns too low of a value comparing bitcoin usage to solana
    percentage: "20%",
  });

  const COMPETITOR_STATISTICS = useRef([
    {
      label: t("energy-usage.stats.household.label"),
      statistic: t("energy-usage.stats.household.stat"),
      color: "#FF5555",
      percentage: "100%",
    },
    {
      label: t("energy-usage.stats.bitcoin.label"),
      statistic: t("energy-usage.stats.bitcoin.stat"),
      color: "#ff623a",
      percentage: "75%",
    },
    {
      label: t("energy-usage.stats.ac.label"),
      statistic: t("energy-usage.stats.ac.stat"),
      color: "#ff9800",
      percentage: "60%",
    },
    {
      label: t("energy-usage.stats.gaming.label"),
      statistic: t("energy-usage.stats.gaming.stat"),
      color: "#ffc107",
      percentage: "55%",
    },

    {
      label: t("energy-usage.stats.refrigerator.label"),
      statistic: t("energy-usage.stats.refrigerator.stat"),
      color: "#e5bd02",
      percentage: "50%",
    },
    {
      label: t("energy-usage.stats.computer.label"),
      statistic: t("energy-usage.stats.computer.stat"),
      color: "#ffd512",
      percentage: "45%",
    },
    {
      label: t("energy-usage.stats.ethereum.label"),
      statistic: t("energy-usage.stats.ethereum.stat"),
      color: "#8bc34a",
      percentage: "30%",
    },
    {
      label: t("energy-usage.stats.lightbulb.label"),
      statistic: t("energy-usage.stats.lightbulb.stat"),
      color: "#03a461",
      percentage: "20%",
    },
    {
      label: t("energy-usage.stats.google.label"),
      statistic: t("energy-usage.stats.google.stat"),
      color: "#14F195",
      percentage: "10%",
    },
  ]);

  const [activeStat, setActiveStat] = useState(0);
  const onChangeStat = useCallback((index) => {
    if (index >= COMPETITOR_STATISTICS.current.length) {
      setActiveStat(0);
    } else if (index < 0) {
      setActiveStat(COMPETITOR_STATISTICS.current.length - 1);
    } else {
      setActiveStat(index);
    }
  }, []);

  return (
    <div className={styles["instagram-energy-usage"]}>
      <div
        className={classNames(
          "container-fluid",
          "py-10",
          styles["instagram-energy-usage__container"],
        )}
      >
        <div className="position-relative">
          <div className={styles["instagram-energy-usage__row"]}>
            <div className={styles["instagram-energy-usage__content"]}>
              <h3 className={styles["instagram-energy-usage__title"]}>
                {t("energy-usage.title")}
              </h3>
              <p className={styles["instagram-energy-usage__description"]}>
                <Trans
                  i18nKey="energy-usage.description"
                  components={{
                    energyLink: <Link to="/environment" />,
                  }}
                />
              </p>
            </div>
            <div className={styles["instagram-energy-usage__stats"]}>
              <InstagramEnergyUsageBar
                value={SOLANA_STATISTIC.current.statistic}
                label={SOLANA_STATISTIC.current.label}
                unit={t("energy-usage.energy-unit")}
                color={SOLANA_STATISTIC.current.color}
                percentage={SOLANA_STATISTIC.current.percentage}
              />
              <InstagramEnergyUsageBar
                value={COMPETITOR_STATISTICS.current[activeStat].statistic}
                label={COMPETITOR_STATISTICS.current[activeStat].label}
                unit={t("energy-usage.energy-unit")}
                color={COMPETITOR_STATISTICS.current[activeStat].color}
                percentage={
                  COMPETITOR_STATISTICS.current[activeStat].percentage
                }
              />
              <div className={styles["instagram-energy-usage__stats-ctrls"]}>
                <button
                  type="button"
                  onClick={() => onChangeStat(activeStat + 1)}
                  className={styles["instagram-energy-usage__stats-ctrl"]}
                  aria-label={t("energy-usage.prev-label")}
                >
                  <PrevIcon />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeStat(activeStat - 1)}
                  className={styles["instagram-energy-usage__stats-ctrl"]}
                  aria-label={t("energy-usage.next-label")}
                >
                  <NextIcon />
                </button>
              </div>
            </div>
            <div
              className={styles["instagram-energy-usage__background-wrapper"]}
            >
              <Image
                src={Background}
                alt=""
                className={styles["instagram-energy-usage__background"]}
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
