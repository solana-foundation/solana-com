import { FC } from "react";
import styles from "./AccelerateInfoItem.module.scss";
import classNames from "classnames";

export const AccelerateInfoItem: FC<{
  term: string;
  value: string;
  subtitle?: string;
  padSubtitle?: boolean;
  attributes?: any;
}> = ({ term, value, subtitle, padSubtitle = false, attributes }) => {
  const shouldPad = !subtitle?.trim() && padSubtitle;
  return (
    <div {...attributes} className={styles.root}>
      <p className={styles.term}>
        <small>{term}</small>
      </p>
      <p className={styles.value}>
        <strong>{value}</strong>
      </p>
      <p
        className={classNames("subdued", styles.subtitle, {
          [styles.padded]: true,
        })}
      >
        <small>{shouldPad ? <>&nbsp;</> : subtitle}</small>
      </p>
    </div>
  );
};
