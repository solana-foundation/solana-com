import classNames from "classnames";
import { ArrowUpRight } from "react-feather";
import Button from "../../../shared/Button";
import { useTranslations } from "next-intl";
import styles from "./DevelopersDocumentItem.module.scss";

export default function DevelopersDocumentItem({
  title,
  description,
  url,
  newTab = true,
  ctaLabel,
}) {
  const t = useTranslations();

  return (
    <div className={styles["document-item"]}>
      <div
        className={classNames(
          styles["document-item__header"],
          "flex justify-between items-center",
        )}
      >
        <h3 className={styles["document-item__title"]}>{title}</h3>
        <Button
          to={url}
          newTab={newTab}
          className={styles["document-item__cta"]}
          aria-label={ctaLabel || t("developers.documents.view-all")}
        >
          <span>{ctaLabel || t("developers.documents.view-all")}</span>
          <ArrowUpRight strokeWidth={1} />
        </Button>
      </div>
      <p className={styles["document-item__description"]}>{description}</p>
    </div>
  );
}
