import { FC } from "react";
import styles from "./AcceleratePricing.module.scss";

export const AcceleratePricing: FC<{
  label: string;
  price: number;
  attributes: any;
}> = ({ label, price, attributes }) => {
  return (
    <p {...attributes} className={styles.root}>
      <small className="subdued">{label}</small>
      <br />
      <strong className={styles.price}>${price}</strong>
    </p>
  );
};
