import Button from "../../../shared/Button";
import { useTranslation } from "next-i18next";
import DevelopersContent from "./DevelopersContent";
import YoutubeIcon from "../../../../../assets/developers/content/youtube.inline.svg";
import PodcastIcon from "../../../../../assets/developers/content/podcast.inline.svg";

import styles from "./DevelopersOtherContent.module.scss";

export default function DevelopersOtherContent() {
  const { t } = useTranslation();
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
          <YoutubeIcon width={26} height={19} className="ms-2" />
        </Button>
        <Button to="/validated">
          {t("developers.content.other-content.latest-episode")}
          <PodcastIcon width={24} height={24} className="ms-2" />
        </Button>
      </div>
    </DevelopersContent.Container>
  );
}
