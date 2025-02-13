import classNames from "classnames";
import { FC, ReactNode } from "react";
import styles from "./AccelerateNavButton.module.scss";

export const AccelerateButton: FC<{
  children: ReactNode;
  variant: "none" | "scale" | "ship";
}> = ({ children, variant = "none" }) => {
  const isVariant = variant !== "none";
  return (
    <button
      data-variant={variant}
      data-is-variant={isVariant}
      className={classNames(
        styles.root,
        { [styles.some]: isVariant },
        styles[variant],
      )}
    >
      {children}
    </button>
  );
};
