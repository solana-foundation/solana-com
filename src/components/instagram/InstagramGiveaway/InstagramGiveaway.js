import { memo } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./InstagramGiveaway.module.scss";
import Illustration from "../../../../assets/instagram/giveaway-form/giveaway-illustration.png";
import InstagramColorGlow from "../InstagramColorGlow/InstagramColorGlow";
import InstagramGiveawayForm from "./InstagramGiveawayForm/InstagramGiveawayForm";
import Image from "next/legacy/image";

export default memo(function InstagramGiveaway() {
  const { t } = useTranslation("common");

  return (
    <section className={styles["instagram-giveaway-form"]}>
      <div
        className={classNames(
          "container-fluid",
          styles["instagram-giveaway-form__container"],
        )}
      >
        <div className={styles["instagram-giveaway-form__illustration"]}>
          <div className={styles["instagram-giveaway-form__img-container"]}>
            <div className={styles["instagram-giveaway-form__img-wrapper"]}>
              <div className={styles["instagram-giveaway-form__img"]}>
                <Image
                  alt=""
                  src={Illustration}
                  quality={90}
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles["instagram-giveaway-form__content"]}>
          <h3
            className={styles["instagram-giveaway-form__title"]}
            id="giveaway-form"
          >
            {t("instagram.giveaway-form.title")}
          </h3>
          <p className={styles["instagram-giveaway-form__description"]}>
            {t("instagram.giveaway-form.description")}
          </p>
          <form className={styles["instagram-giveaway-form__form"]}>
            <InstagramGiveawayForm />
          </form>
        </div>
      </div>
      <div className={styles["instagram-giveaway-form__glow-bgs"]}>
        <InstagramColorGlow
          color="purple"
          positionBottom="-160px"
          positionLeft="22%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--mobile"],
          )}
          width={800}
          height={800}
        />
        <InstagramColorGlow
          color="yellow"
          positionBottom="0"
          positionLeft="80%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--mobile"],
          )}
          width={800}
          height={800}
        />
        <InstagramColorGlow
          color="red"
          positionBottom="0"
          positionLeft="-20%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--mobile"],
          )}
          width={550}
          height={550}
        />
        <InstagramColorGlow
          color="red"
          positionBottom="-200px"
          positionLeft="0"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--desktop"],
          )}
          width={1000}
          height={1000}
        />
        <InstagramColorGlow
          color="yellow"
          positionBottom="-200px"
          positionLeft="15%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--desktop"],
          )}
          width={1200}
          height={1200}
        />
        <InstagramColorGlow
          color="purple"
          positionBottom="-450px"
          positionLeft="35%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--desktop"],
          )}
          width={1500}
          height={1500}
        />
        <InstagramColorGlow
          color="green"
          positionBottom="-700px"
          positionLeft="65%"
          className={classNames(
            styles["instagram-giveaway-form__glow-bg"],
            styles["instagram-giveaway-form__glow-bg--desktop"],
          )}
          width={1500}
          height={1500}
        />
      </div>
    </section>
  );
});
