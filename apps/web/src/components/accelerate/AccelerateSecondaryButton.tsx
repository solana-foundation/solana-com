import { FC } from "react";
import styles from "./AccelerateSecondaryButton.module.scss";
import Link from "next/link";
import classNames from "classnames";
import type { SolanaLibAttributes } from "@/types/solana-lib";

export const AccelerateSecondaryButton: FC<{
  label: string;
  url: string;
  capitalize?: boolean;
  inverted?: boolean;
  attributes: SolanaLibAttributes;
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
