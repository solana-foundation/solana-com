import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./EnvironmentHero.module.scss";

export default function EnvironmentHero() {
  const { t } = useTranslation();

  return (
    <>
      <section className={classNames("container", styles["environment-hero"])}>
        <div className="row">
          <div className="col-12 col-lg-6">
            <h1 className={styles["environment-hero__title"]}>
              {t("environment.hero.title-part-1")}
              <br />
              {t("environment.hero.title-part-2")}
            </h1>
            <p
              className={classNames(
                "subdued",
                styles["environment-hero__subtitle"],
              )}
            >
              {t("environment.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>
      <div className={styles["environment-hero__background"]}></div>
    </>
  );
}
