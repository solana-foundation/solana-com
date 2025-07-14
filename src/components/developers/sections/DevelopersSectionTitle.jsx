import { useTranslations } from "next-intl";
import styles from "./DevelopersSectionTitle.module.scss";

export default function DevelopersSectionTitle({ titleId }) {
  const t = useTranslations();
  return <h2 className={styles["section-title"]}>{t(titleId)}</h2>;
}
