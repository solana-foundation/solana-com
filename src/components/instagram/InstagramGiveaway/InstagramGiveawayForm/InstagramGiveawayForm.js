import { memo, useState } from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import styles from "./InstagramGiveawayForm.module.scss";
import AnimatedCta from "../../../shared/AnimatedCta/AnimatedCta";
import { noop } from "lodash";

const InstagramGiveawayForm = memo(function () {
  const { t } = useTranslation("common");

  const [email, setEmail] = useState({
    type: "email",
    value: "",
    isValid: false,
    isDirty: false,
  });

  const [address, setAddress] = useState({
    type: "address",
    value: "",
    isValid: false,
    isDirty: false,
  });

  const [postUrl, setPostUrl] = useState({
    type: "postUrl",
    value: "",
    isValid: false,
    isDirty: false,
  });

  const isValid = (value, type) => {
    switch (type) {
      case "email": {
        return (
          value
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ) || value === ""
        );
      }
      case "address": {
        try {
          return true;
        } catch (_) {
          return false;
        }
      }
      case "postUrl": {
        return (
          value
            .toLowerCase()
            .match(
              /^https:\/\/www\.(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim,
            ) ||
          value
            .toLowerCase()
            .match(
              /^https:\/\/www\.facebook\.com\/(photo(\.php|s)|permalink\.php|media|questions|notes|[^\/]+\/(activity|posts))[\/?].*$/gm,
            )
        );
      }
      default: {
        return true;
      }
    }
  };

  return (
    <div className={styles["instagram-giveaway-form"]}>
      <div className={styles["instagram-giveaway-form__ctrl"]}>
        <input
          onChange={(e) =>
            setAddress({
              ...address,
              value: e.target.value,
              isValid: isValid(e.target.value, address.type),
              isDirty: true,
            })
          }
          type="text"
          aria-label={t("instagram.giveaway-form.form.address-aria-label")}
          placeholder={t("instagram.giveaway-form.form.address-label")}
          value={address.value}
          aria-required="true"
          aria-invalid={!address.isValid}
          aria-describedby={!address.isValid && "address-error"}
          className={classNames(styles["instagram-giveaway-form__input"], {
            [styles["instagram-giveaway-form__input--invalid"]]:
              !address.isValid && address.isDirty,
          })}
          disabled
        />
        {!address.isValid && address.isDirty && (
          <span
            className={styles["instagram-giveaway-form__error-msg"]}
            id="address-error"
            role="alert"
          >
            {t("instagram.giveaway-form.form.address-error")}
          </span>
        )}
      </div>
      <div className={styles["instagram-giveaway-form__ctrl"]}>
        <input
          onChange={(e) =>
            setPostUrl({
              ...postUrl,
              value: e.target.value,
              isValid: isValid(e.target.value, postUrl.type),
              isDirty: true,
            })
          }
          type="text"
          aria-label={t("instagram.giveaway-form.form.posturl-aria-label")}
          placeholder={t("instagram.giveaway-form.form.posturl-label")}
          value={postUrl.value}
          aria-required="true"
          aria-invalid={!address.isValid}
          aria-describedby={!address.isValid && "posturl-error"}
          className={classNames(styles["instagram-giveaway-form__input"], {
            [styles["instagram-giveaway-form__input--invalid"]]:
              !postUrl.isValid && postUrl.isDirty,
          })}
          disabled
        />
        {!postUrl.isValid && postUrl.isDirty && (
          <span
            className={styles["instagram-giveaway-form__error-msg"]}
            id="posturl-error"
            role="alert"
          >
            {t("instagram.giveaway-form.form.posturl-error")}
          </span>
        )}
      </div>
      <div className={styles["instagram-giveaway-form__ctrl"]}>
        <input
          onChange={(e) =>
            setEmail({
              ...email,
              value: e.target.value,
              isValid: isValid(e.target.value, email.type),
              isDirty: true,
            })
          }
          type="email"
          aria-label={t("instagram.giveaway-form.form.email-aria-label")}
          placeholder={t("instagram.giveaway-form.form.email-label")}
          aria-describedby={!address.isValid && "email-error"}
          value={email.value}
          aria-required="true"
          aria-invalid={!address.isValid}
          className={classNames(styles["instagram-giveaway-form__input"], {
            [styles["instagram-giveaway-form__input--invalid"]]:
              !email.isValid && email.isDirty,
          })}
          disabled
        />
        {!email.isValid && email.isDirty && (
          <span
            className={styles["instagram-giveaway-form__error-msg"]}
            id="email-error"
            role="alert"
          >
            {t("instagram.giveaway-form.form.email-error")}
          </span>
        )}
      </div>
      <AnimatedCta size="large" onClick={noop} disabled>
        {t("instagram.giveaway-form.form.submit")}
      </AnimatedCta>
    </div>
  );
});

export default InstagramGiveawayForm;
