import classNames from "classnames";
import Image from "next/legacy/image";
import type { StaticImageData } from "next/image";

import styles from "./HackathonWinnerCard.module.scss";

interface HackathonWinnerCardProps {
  logo: StaticImageData;
  alt: string;
  width: number;
  height: number;
}

export default function HackathonWinnerCard({
  logo,
  alt,
  width,
  height,
}: HackathonWinnerCardProps) {
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
