import classNames from "classnames";

import PodcastBranding from "../PodcastBranding";
import PodcastEpisode from "./PodcastEpisode";

import styles from "./PodcastEpisodeSection.module.scss";

export default function PodcastEpisodeSection({ episode }) {
  return (
    <section className="position-relative">
      <div className="d-flex flex-column flex-sm-row">
        <div
          className={classNames(
            "col-12 col-md-7 d-flex flex-column",
            styles["episode"],
          )}
        >
          <PodcastEpisode episode={episode} />
        </div>
        <div className="d-none d-md-block col-md-5">
          <PodcastBranding />
        </div>
      </div>
    </section>
  );
}
