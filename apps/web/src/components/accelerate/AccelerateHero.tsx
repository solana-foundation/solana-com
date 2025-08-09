import React, { FC, ReactNode } from "react";
import styles from "./AccelerateHero.module.scss";

interface AccelerateHeroProps {
  variant: "none" | "scale" | "ship";
  children: ReactNode;
  attributes: any;
}

export const AccelerateHero: FC<AccelerateHeroProps> = ({
  variant = "none",
  children,
  attributes,
}) => {
  return (
    <div {...attributes}>
      <section className={styles.hero} data-variant={variant}>
        <div className={styles.inner}>{children}</div>
      </section>
    </div>
  );
};
