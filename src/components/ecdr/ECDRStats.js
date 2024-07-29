import { Trans, useTranslation } from "next-i18next";
import classNames from "classnames";
import Link from "../../utils/Link";
import { FormattedNumber } from "../SolFormattedMessage";
import styles from "./ECDRStats.module.scss";
import ClipboardIcon from "../../../public/src/img/ecdr/clipboard.inline.svg";

const StatCard = ({ value, description = "", note = "", className }) => (
  <div className={classNames("text-center", styles["ecdr-stats__card"])}>
    <div
      className={classNames(
        "my-4",
        styles["ecdr-stats__card--title"],
        className,
      )}
    >
      {typeof value == "number" ? <FormattedNumber value={value} /> : value}
    </div>
    <p className={styles["ecdr-stats__card--description"]}>{description}</p>
    <p className={styles["ecdr-stats__card--note"]}>{note}</p>
  </div>
);

const ECDRStats = () => {
  const { t } = useTranslation("common");
  const openSourceTitle = t("ecdr.stats.open-source.title", {
    returnObjects: true,
  });
  return (
    <div
      className={classNames("mt-4 container", styles["ecdr-stats__container"])}
    >
      <div className={styles["ecdr-stats__effect"]} />
      <div className={styles["ecdr-stats__heading"]}>
        <div className="col-lg-6">
          <h2 className={styles["ecdr-stats__heading--title"]}>
            {t("ecdr.stats.title")}
          </h2>
        </div>
        <div className="col-lg-4">
          <div className="d-flex">
            <ClipboardIcon className="me-2" width="24" height="26" />
            <p className={styles["ecdr-stats__heading--learn"]}>
              <Trans
                i18nKey="ecdr.stats.learn"
                components={{
                  learnLink: (
                    <Link
                      to="/news/the-values-that-got-us-here-solana-2023"
                      onClick={() => {
                        gtag("event", "Link click", {
                          event_category: "Open blog link",
                          event_label: "EC Developers Report - Blog link",
                        });
                      }}
                    />
                  ),
                }}
              />
            </p>
          </div>
        </div>
      </div>
      <div className={styles["ecdr-stats__cards"]}>
        <StatCard
          value="16x"
          description={t("ecdr.stats.full-time.title")}
          className={styles["ecdr-stats__card--purple"]}
        />
        <StatCard
          value="83%"
          description={t("ecdr.stats.blockchain.title")}
          className={styles["ecdr-stats__card--blue"]}
        />
        <StatCard
          value={2000}
          description={t("ecdr.stats.active-developers.title")}
          className={styles["ecdr-stats__card--green"]}
          note={t("ecdr.stats.active-developers.note")}
        />
      </div>
      <div className="row">
        <h2 className={styles["ecdr-stats__open-source--title"]}>
          <span className="d-block">{openSourceTitle[0].phrase}</span>
          <span className="d-block d-md-inline-block">
            {openSourceTitle[1].phrase}
          </span>{" "}
          <span className="d-block d-md-inline-block">
            {openSourceTitle[2].phrase}
          </span>
          <span className="d-block">{openSourceTitle[3].phrase}</span>
        </h2>
        <p className="col-md-6 mt-4 mx-auto text-center">
          {t("ecdr.stats.open-source.description")}
        </p>
      </div>
    </div>
  );
};

export default ECDRStats;
