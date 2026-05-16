import classNames from "classnames";
import styles from "./PossibleGlow.module.scss";

type PossibleGlowProps = {
  backgroundColor: string;
  top: string;
  left: string;
  height: string;
  width: string;
  rotation: string;
  className?: string;
};

const PossibleGlow = ({
  backgroundColor,
  top,
  left,
  height,
  width,
  rotation,
  className,
}: PossibleGlowProps) => {
  return (
    <div
      className={classNames(
        styles["glow--possible"],
        `possible-glow ${className ? className : null}`,
      )}
      style={
        {
          "--background-color": backgroundColor,
          "--top": top,
          "--left": left,
          "--height": height,
          "--width": width,
          "--rotation": rotation,
        } as React.CSSProperties
      }
    ></div>
  );
};

export default PossibleGlow;
