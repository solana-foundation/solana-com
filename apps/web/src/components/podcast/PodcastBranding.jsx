import classNames from "classnames";
import Image from "next/legacy/image";

import BgImage from "../../../assets/podcast/background-art.inline.svg";
import solanaPodcastLogo from "../../../assets/podcast/solana-podcast-logo.jpeg";

import styles from "./PodcastBranding.module.scss";

export default function PodcastBranding() {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-end",
        styles["branding"],
      )}
    >
      <div className={styles["branding__background"]}>
        <BgImage />
      </div>
      <div className={styles["branding__logo"]}>
        <Image src={solanaPodcastLogo} />
      </div>
    </div>
  );
}
