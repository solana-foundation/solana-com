import { FC } from "react";
import styles from "./AccelerateSecondaryButton.module.scss";
import Link from "next/link";
import classNames from "classnames";

export const AccelerateSecondaryButton: FC<{
  label: string;
  url: string;
  capitalize?: boolean;
  inverted?: boolean;
  attributes: any;
}> = ({ label, url = "", capitalize = true, inverted = false, attributes }) => {
  return (
    <Link href={url}>
      <button
        {...attributes}
        className={classNames(styles.btn, {
          [styles.capitalize]: capitalize,
          [styles.inverted]: inverted,
        })}
      >
        {label}
      </button>
    </Link>
  );
};
