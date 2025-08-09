import { FC, ReactNode } from "react";
import styles from "./AccelerateNavButton.module.scss";

export const AccelerateButton: FC<{
  children: ReactNode;
  variant: "none" | "scale" | "ship";
}> = ({ children, variant = "none" }) => {
  return (
    <button data-variant={variant} className={styles.root}>
      {children}
    </button>
  );
};
