import classNames from "classnames";
import styles from "./PossibleGlow.module.scss";

const PossibleGlow = ({
  backgroundColor,
  top,
  left,
  height,
  width,
  rotation,
  className,
}) => {
  return (
    <div
      className={classNames(
        styles["glow--possible"],
        `possible-glow ${className ? className : null}`,
      )}
      style={{
        "--background-color": backgroundColor,
        "--top": top,
        "--left": left,
        "--height": height,
        "--width": width,
        "--rotation": rotation,
      }}
    ></div>
  );
};

export default PossibleGlow;
