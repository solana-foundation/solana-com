import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";

type SidebarToggleButtonProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarToggleButton = ({
  visible,
  setVisible,
}: SidebarToggleButtonProps) => (
  <button
    className={classNames(
      styles["developers-content-page__sidebar-toggle"],
      visible && styles["developers-content-page__sidebar-toggle__active"],
    )}
    onClick={() => setVisible(!visible)}
    aria-label="Toggle"
  >
    <span
      className={styles["developers-content-page__sidebar-toggle__bar"]}
    ></span>
    <span
      className={styles["developers-content-page__sidebar-toggle__bar"]}
    ></span>
    <span
      className={styles["developers-content-page__sidebar-toggle__bar"]}
    ></span>
  </button>
);
