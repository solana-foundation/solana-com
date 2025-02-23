import cx from "classnames";

import styles from "./index.module.scss";

function Loader({ color = "#1a3989" }) {
  return (
    <div
      className={cx(styles.div, "tl-dashboard-loader")}
      style={{ ["--loader-color"]: color }}
    >
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
      <span className={styles.span}></span>
    </div>
  );
}

export default Loader;
