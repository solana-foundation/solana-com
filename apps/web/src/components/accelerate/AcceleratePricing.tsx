import { FC } from "react";
import styles from "./AcceleratePricing.module.scss";
import type { SolanaLibAttributes } from "@/types/solana-lib";

export const AcceleratePricing: FC<{
  label: string;
  price: number;
  attributes: SolanaLibAttributes;
}> = ({ label, price, attributes }) => {
  return (
    <p {...attributes} className={styles.root}>
      <small className="subdued">{label}</small>
      <br />
      <strong className={styles.price}>${price}</strong>
    </p>
  );
};
