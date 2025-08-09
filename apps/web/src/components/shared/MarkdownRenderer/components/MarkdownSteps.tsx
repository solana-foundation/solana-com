import React, { ReactNode } from "react";
import styles from "./MarkdownSteps.module.scss";

interface MarkdownStepsProps {
  children: ReactNode;
}

export function MarkdownSteps({ children, ...props }: MarkdownStepsProps) {
  return (
    <div {...props} className={styles["markdown-steps"]}>
      {children}
    </div>
  );
}
