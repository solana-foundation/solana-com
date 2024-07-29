import { useTranslation } from "next-i18next";
import { Rss as PodcastFeedIcon } from "react-feather";

import Link, { InlineLink } from "../../utils/Link";

import TwitterIcon from "../../../public/src/img/footer/twitter.inline.svg";

import styles from "./PodcastNavigation.module.scss";

export default function PodcastNavigation() {
  const { t } = useTranslation();

  return (
    <div className={styles["podcast-navigation"]}>
      <div>
        <Link
          to="/validated"
          activeClassName={styles["podcast-navigation__active"]}
        >
          {t("podcast.navigation.home")}
        </Link>
        <Link
          to="/validated/episodes"
          partiallyActive
          activeClassName={styles["podcast-navigation__active"]}
        >
          {t("podcast.navigation.episodes")}
        </Link>
      </div>
      <div className={styles["podcast-navigation__socials"]}>
        <InlineLink
          to="https://feeds.simplecast.com/W1NI2v3Z"
          aria-label="Podcast feed"
        >
          <PodcastFeedIcon size={22} color="#fff" />
        </InlineLink>
        <InlineLink to="/twitter" aria-label="Twitter">
          <TwitterIcon height={22} width={22} color="#fff" fill="#fff" />
        </InlineLink>
      </div>
    </div>
  );
}
