import Image from "next/legacy/image";
import Button from "../../../shared/Button";
import { useTranslation } from "next-i18next";
import OverviewImg from "../../../../../assets/hackathon/overview.png";
import styles from "./HackathonOverviewSection.module.scss";

export default function HackathonOverviewSection({ onGetNotified }) {
  const { t } = useTranslation();

  return (
    <section className={styles["overview"]}>
      <div className="container">
        <div className={styles["overview__content"]}>
          <div className={styles["overview__content--graphic"]}>
            <Image
              layout="intrinsic"
              src={OverviewImg}
              alt="hackathon-overview"
            />
          </div>
          <div className={styles["overview__content--cta-contents"]}>
            <h2 className={styles["title"]}>{t("hackathon.overview.title")}</h2>
            <p className="subdued">{t("hackathon.overview.description")}</p>
            <Button onClick={onGetNotified} variant="secondary">
              {t("hackathon.overview.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
