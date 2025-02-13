import { FC } from "react";
import styles from "./AccelerateLearnMoreButton.module.scss";
import Link from "next/link";

export const AccelerateLearnMoreButton: FC<{
  label: string;
  url: string;
  attributes: any;
}> = ({ label, url = "", attributes }) => {
  return (
    <Link href={url}>
      <button {...attributes} className={styles.btn}>
        {label}
      </button>
    </Link>
  );
};
