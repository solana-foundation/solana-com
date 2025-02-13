import { FC } from "react";
import styles from "./AccelerateInfoItem.module.scss";
import classNames from "classnames";

function pad(s: string, pad: boolean) {
  if (!s?.trim() && pad) {
    return <>&nbsp;</>;
  }

  return s;
}

export const AccelerateInfoItem: FC<{
  term: string;
  value: string;
  subtitle?: string;
  padSubtitle?: boolean;
  attributes?: any;
}> = ({ term, value, subtitle, padSubtitle = false, attributes }) => {
  return (
    <div {...attributes} className={styles.root}>
      <p className={styles.term}>
        <small>{term}:</small>
      </p>
      <p className={styles.value}>
        <strong>{value}</strong>
      </p>
      <p className={classNames("subdued", styles.subtitle)}>
        <small>{pad(subtitle, padSubtitle)}</small>
      </p>
    </div>
  );
};
