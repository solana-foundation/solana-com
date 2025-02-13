import { FC } from "react";
import styles from "./AccelerateAttendance.module.scss";
import classNames from "classnames";

export const AccelerateAttendance: FC<{
  label: string;
  note: string;
  subnote?: string;
}> = ({ label, note, subnote }) => {
  return (
    <div className={styles.root}>
      <p className={styles.label}>{label}</p>
      <p className={classNames("subdued", styles.note)}>
        <small>{note}</small>
      </p>
      {subnote && (
        <p className={classNames("subdued", styles.subnote)}>
          <sub>{subnote}</sub>
        </p>
      )}
    </div>
  );
};
