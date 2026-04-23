import classNames from "classnames";
import type { ReactNode } from "react";

import styles from "./DevelopersContent.module.scss";

function Title({ children }: { children: ReactNode }) {
  return <h3 className={styles["content-title"]}>{children}</h3>;
}

function Description({ children }: { children: ReactNode }) {
  return (
    <p className={classNames("subdued", styles["content-description"])}>
      {children}
    </p>
  );
}

function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={classNames(
        styles["content-container"],
        "h-100 justify-content-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

const DevelopersContent = {
  Container,
  Title,
  Description,
};

export default DevelopersContent;
