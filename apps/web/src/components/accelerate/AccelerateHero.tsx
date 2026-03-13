import React, { FC, ReactNode } from "react";
import styles from "./AccelerateHero.module.scss";
import type { SolanaLibAttributes } from "@/types/solana-lib";

interface AccelerateHeroProps {
  variant: "none" | "scale" | "ship";
  children: ReactNode;
  attributes: SolanaLibAttributes;
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
