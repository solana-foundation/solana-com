import classNames from "classnames";

import styles from "./DevelopersContent.module.scss";

function Title({ children }) {
  return <h3 className={styles["content-title"]}>{children}</h3>;
}

function Description({ children }) {
  return (
    <p className={classNames("subdued", styles["content-description"])}>
      {children}
    </p>
  );
}

function Container({ className, children }) {
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
