import { FC } from "react";
import styles from "./AccelerateApplyButton.module.scss";

export const AccelerateApplyButton: FC<{
  label: string;
  url: string;
  attributes: any;
}> = ({ label, url = "", attributes }) => {
  return (
    <a href={url} target="_blank" {...attributes}>
      <button className={styles.btn}>
        <span>{label}</span>
      </button>
    </a>
  );
};
