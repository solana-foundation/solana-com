import Button from "../../../shared/Button";
import { useTranslations } from "next-intl";
import DevelopersContent from "./DevelopersContent";
import { Youtube } from "@boxicons/react/Youtube";
import { Podcast } from "@boxicons/react/Podcast";

import styles from "./DevelopersOtherContent.module.scss";

export default function DevelopersOtherContent() {
  const t = useTranslations();
  return (
    <DevelopersContent.Container className={styles["container"]}>
      <div>
        <DevelopersContent.Title>
          {t("developers.content.other-content.title")}
        </DevelopersContent.Title>
        <DevelopersContent.Description>
          {t("developers.content.other-content.description")}
        </DevelopersContent.Description>
      </div>
      <div className={styles["other-content-links"]}>
        <Button to="/youtube" newTab>
          {t("developers.content.other-content.latest-video")}
          <Youtube
            width={26}
            height={19}
            fill="#ED1D24"
            className="ms-2"
            aria-hidden="true"
          />
        </Button>
        <Button to="/validated">
          {t("developers.content.other-content.latest-episode")}
          <Podcast
            width={24}
            height={24}
            pack="filled"
            fill="#F452FF"
            className="ms-2"
            aria-hidden="true"
          />
        </Button>
      </div>
    </DevelopersContent.Container>
  );
}
