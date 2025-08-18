import { FC, ReactNode } from "react";
import styles from "./AccelerateInfoSection.module.scss";
import Link from "next/link";

export const AccelerateInfoSection: FC<{
  children: ReactNode;
  label: string;
  subtitle: string;
  url: string;
  variant: "scale" | "ship";
}> = ({ children, label, subtitle, variant }) => {
  return (
    <div>
      <Link href={`/accelerate/${variant}-or-die`} style={{ color: "inherit" }}>
        <h2 className="h5 text-center">{label}</h2>

        <div data-variant={variant} className={styles.subtitle}>
          {subtitle}
        </div>
      </Link>
      {children}
    </div>
  );
};
