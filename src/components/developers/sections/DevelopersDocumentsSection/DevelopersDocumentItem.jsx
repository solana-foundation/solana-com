import classNames from "classnames";
import { ArrowUpRight } from "react-feather";
import Button from "../../../shared/Button";
import { useTranslation } from "next-i18next";
import styles from "./DevelopersDocumentItem.module.scss";

export default function DevelopersDocumentItem({
  title,
  description,
  url,
  newTab = true,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles["document-item"]}>
      <div
        className={classNames(
          styles["document-item__header"],
          "d-flex justify-content-between align-items-center",
        )}
      >
        <h3 className={styles["document-item__title"]}>{title}</h3>
        <Button
          to={url}
          newTab={newTab}
          className={styles["document-item__cta"]}
          aria-label={t("developers.documents.view-all")}
        >
          <span>{t("developers.documents.view-all")}</span>
          <ArrowUpRight strokeWidth={1} />
        </Button>
      </div>
      <p className={styles["document-item__description"]}>{description}</p>
    </div>
  );
}
