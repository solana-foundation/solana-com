import classNames from "classnames";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import bgSmall from "../../../assets/ai/hero-bg-small.png";
import bgLarge from "../../../assets/ai/hero-bg-large.png";

import styles from "./AiHero.module.scss";

export default function AiHero() {
  const t = useTranslations();

  return (
    <div className="relative mb-12">
      <div className={styles["hero__bg--small"]}>
        <Image src={bgSmall} alt="" priority fill />
      </div>
      <div className={styles["hero__bg--large"]}>
        <Image src={bgLarge} alt="" priority fill />
      </div>
      <div className={classNames("container", styles["hero__container"])}>
        <div className={styles["hero__content"]}>
          <h1 className={classNames("h2 mb-4", styles["hero__title"])}>
            {t.rich("ai.hero.title", {
              colored: (chunks) => (
                <span className={styles["hero__title--colored"]}>{chunks}</span>
              ),
            })}
          </h1>
          <div className={classNames("lg:w-3/4", styles["hero__points"])}>
            <p className="mb-0">{t("ai.hero.point-3")}</p>
          </div>
          <Button
            newTab
            size="large"
            to="/developers/guides/getstarted/intro-to-ai"
            variant="secondary"
          >
            {t("ai.hero.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
