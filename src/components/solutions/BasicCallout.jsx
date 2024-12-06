import classNames from "classnames";
import { Trans } from "next-i18next";

import { AnimatedText } from "@/components/shared/Text";

import styles from "./BasicCallout.module.scss";

const BasicCallout = ({ titleContent, subtitleKey, className, id }) => {
  return (
    <div
      className={classNames(styles.BasicCallout, "page-width", className)}
      id={id}
    >
      <div className={classNames(styles.Container)}>
        <div className={styles.ContentWrapper}>
          {titleContent && (
            <AnimatedText element="h2" as="heading" className={styles.Title}>
              {titleContent}
            </AnimatedText>
          )}

          {subtitleKey && (
            <AnimatedText
              element="p"
              as="paragraph"
              className={styles.Subtitle}
            >
              <Trans i18nKey={subtitleKey} />
            </AnimatedText>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicCallout;
