import classNames from "classnames";
import Image from "next/legacy/image";

import styles from "./HackathonWinnerCard.module.scss";

export default function HackathonWinnerCard({ logo, alt, width, height }) {
  return (
    <div
      className={classNames(
        "flex justify-center items-center",
        styles["winner-card"],
      )}
    >
      <Image
        alt={alt}
        src={logo}
        layout="fixed"
        width={width}
        height={height}
      />
    </div>
  );
}
