import { useTranslation } from "next-i18next";
import styles from "./DevelopersSectionTitle.module.scss";

export default function DevelopersSectionTitle({ titleId }) {
  const { t } = useTranslation();
  return <h2 className={styles["section-title"]}>{t(titleId)}</h2>;
}
