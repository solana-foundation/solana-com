import { Trans, useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "./PossibleStats.module.scss";
import Link from "../../utils/Link";
import Image from "next/image";
import GlowLines from "../../../public/src/img/index/glow-lines.jpg";

import Loader from "../../../public/src/img/icons/Loader.inline.svg";
import {
  PERF_UPDATE_SEC,
  SAMPLE_HISTORY_HOURS,
  useTransactionStats,
} from "../../hooks/useTransactionStats";
import { FormattedNumber } from "../SolFormattedMessage";
import AnimatedTransactionCountup from "../shared/AnimatedTransactionCountup";

const StatsNo = ({ value, description, className }) => {
  return (
    <>
      <div
        className={classNames("m-0", styles["index-stats__color"], className)}
      >
        {value}
      </div>
      <div
        className={classNames(
          "smaller text-uppercase subdued",
          styles["index-stats__ff-mono"],
        )}
      >
        {description}
      </div>
    </>
  );
};

const StatsCard = ({
  title,
  description,
  value,
  valueName,
  border,
  className,
}) => {
  return (
    <div className={`col-md-6 mb-2 ${className}`}>
      <div className={classNames("p-6", styles["index-stats__card"])}>
        <h3
          className={classNames("h5", styles["index-stats__card__title"])}
          style={{ borderColor: border }}
        >
          {title}
        </h3>
        <p className="small subdued">{description}</p>
        <div className="mt-6">
          {/* Check for the static 0% value of the carbon impact section */}
          {parseInt(value) !== 0 ? (
            <div
              className={classNames(
                "h5 fw-normal",
                styles["index-stats__live"],
              )}
            >
              {value}
            </div>
          ) : (
            <div className="h5 fw-normal" style={{ lineHeight: 1 }}>
              {value}
            </div>
          )}
          <div
            className={classNames(
              "smaller text-uppercase subdued",
              styles["index-stats__ff-mono"],
            )}
          >
            {valueName}
          </div>
        </div>
      </div>
    </div>
  );
};

const PossibleStats = ({ visible, showKPIs = true }) => {
  const { avgTps, validators, totalTransactionCount, availableStats } =
    useTransactionStats({
      visible,
      performanceUpdateSeconds: PERF_UPDATE_SEC,
      sampleHistoryHours: SAMPLE_HISTORY_HOURS,
      getLiveTransactionCount: true,
    });

  const { t } = useTranslation("common");

  return (
    <div className={styles["index-stats"]}>
      <div className={styles["index-stats__glow-lines"]}>
        <Image src={GlowLines} alt="" fill />
      </div>
      <div className="container">
        {showKPIs && (
          <div className="row pb-10">
            <div className="col-lg-6">
              <h2
                className={classNames(
                  "h4 w-lg-75 mt-0 mt-lg-10 mb-8 mb-lg-0",
                  styles["index-stats__heading"],
                )}
              >
                {t("possible.stats.headline")}
              </h2>
            </div>
            <div className="col-lg-6">
              <div className="mb-8">
                <StatsNo
                  value="11.5M+"
                  description={t("possible.stats.accounts")}
                  className={styles["index-stats__color--purple"]}
                />
              </div>
              <div className="mb-8">
                <StatsNo
                  value="21.9M"
                  description={t("possible.stats.nfts")}
                  className={styles["index-stats__color--blue"]}
                />
              </div>
              <div>
                <StatsNo
                  value="$0.00025"
                  description={t("possible.stats.cost")}
                  className={styles["index-stats__color--green"]}
                />
              </div>
            </div>
          </div>
        )}

        <div className="row pt-9 mt-9">
          <div className="col-lg-4">
            <div className="mb-8 mb-lg-0">
              <h2 className={classNames("h4", styles["index-stats__heading"])}>
                {t("possible.stats.headline-secondary")}
              </h2>
              <div
                className={classNames(
                  "smaller text-uppercase subdued",
                  styles["index-stats__live"],
                  styles["index-stats__ff-mono"],
                )}
              >
                {t("possible.stats.live")}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <StatsCard
                title={t("possible.stats.adoption.fast.title")}
                description={t("possible.stats.adoption.fast.description")}
                value={
                  availableStats ? (
                    <FormattedNumber value={avgTps} />
                  ) : (
                    <Loader />
                  )
                }
                valueName={t("possible.stats.transactions")}
                border="#1FCFF1"
              />
              <StatsCard
                title={t("possible.stats.adoption.decentralized.title")}
                description={t(
                  "possible.stats.adoption.decentralized.description",
                )}
                value={
                  availableStats ? (
                    <FormattedNumber value={validators} />
                  ) : (
                    <Loader />
                  )
                }
                valueName={t("possible.stats.validators")}
                border="#FFD512"
                className="mt-lg-n10"
              />
              <StatsCard
                title={t("possible.stats.adoption.scalable.title")}
                description={t("possible.stats.adoption.scalable.description")}
                value={
                  availableStats ? (
                    <AnimatedTransactionCountup
                      info={{ avgTPS: avgTps, totalTransactionCount }}
                      perfUpdateSec={PERF_UPDATE_SEC}
                    />
                  ) : (
                    <Loader />
                  )
                }
                valueName={t("possible.stats.totaltransactions")}
                border="#9945FF"
              />
              <StatsCard
                title={t("possible.stats.adoption.energy.title")}
                description={
                  <Trans
                    i18nKey="possible.stats.adoption.energy.description"
                    components={{
                      envLink: <Link to="/environment" />,
                    }}
                  />
                }
                value="0%"
                valueName={t("possible.stats.carbon")}
                border="#19FB9B"
                className="mt-lg-n8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PossibleStats;
