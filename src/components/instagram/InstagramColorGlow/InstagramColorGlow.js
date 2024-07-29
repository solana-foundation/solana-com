import { memo } from "react";
import classNames from "classnames";
import styles from "./InstagramColorGlow.module.scss";

const DEFAULT_COLOR = "yellow";
const COLORS = [DEFAULT_COLOR, "red", "purple", "green"];

export default memo(function InstagramColorGlow({
  color,
  positionTop = null,
  positionBottom = null,
  positionLeft,
  className,
  width,
  height,
}) {
  if (!COLORS.includes(color)) {
    color === DEFAULT_COLOR;
  }

  return (
    <div
      className={classNames(styles["instagram-color-glow"], {
        [styles["instagram-color-glow--yellow"]]: color === "yellow",
        [styles["instagram-color-glow--red"]]: color === "red",
        [styles["instagram-color-glow--purple"]]: color === "purple",
        [styles["instagram-color-glow--green"]]: color === "green",
        [className]: !!className,
      })}
      style={{
        top: positionTop,
        bottom: positionBottom,
        left: positionLeft,
        width: width ? `${width}px` : null,
        height: height ? `${height}px` : null,
      }}
    />
  );
});
